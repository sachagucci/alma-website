import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

// Get company ID from session
async function getCompanyIdFromSession(): Promise<number | null> {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('alma_client_id')?.value
    if (!clientId) return null

    const client = await pool.connect()
    try {
        const result = await client.query(
            'SELECT id FROM companies WHERE client_id = $1',
            [clientId]
        )
        return result.rows[0]?.id || null
    } finally {
        client.release()
    }
}

// Default fallback prompt
const DEFAULT_EXTRACTION_PROMPT = `Analyze this invoice image and extract JSON with fields: invoice_number, vendor_name, invoice_date, due_date, subtotal, tax_amount, total_amount, currency, category, invoice_type, line_items. Return ONLY valid JSON.`

// Fetch extraction prompt from database
async function getExtractionPrompt(): Promise<string> {
    const client = await pool.connect()
    try {
        const result = await client.query(
            `SELECT content FROM prompt_modules 
             WHERE clinic_id = 'invoice_general' AND slug = 'invoice-prompt' AND is_active = TRUE 
             LIMIT 1`
        )
        return result.rows[0]?.content || DEFAULT_EXTRACTION_PROMPT
    } finally {
        client.release()
    }
}

// Fetch agent config (model, temperature) from database
async function getInvoiceAgentConfig(): Promise<{ model: string; temperature: number }> {
    const client = await pool.connect()
    try {
        const result = await client.query(
            `SELECT model_name, temperature FROM agent_configurations 
             WHERE clinic_id = 'invoice-general' AND is_active = TRUE 
             LIMIT 1`
        )
        return {
            model: result.rows[0]?.model_name || 'gemini-2.0-flash',
            temperature: result.rows[0]?.temperature ?? 0
        }
    } finally {
        client.release()
    }
}

export async function POST(request: NextRequest) {
    try {
        const companyId = await getCompanyIdFromSession()
        if (!companyId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { image } = await request.json()
        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Call Gemini Vision API
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
        }

        // Determine image type and prepare for API
        const isBase64 = image.startsWith('data:')
        let mimeType = 'image/jpeg'
        let imageData = image

        if (isBase64) {
            const match = image.match(/^data:([^;]+);base64,(.+)$/)
            if (match) {
                mimeType = match[1]
                imageData = match[2]
            }
        }

        // Fetch prompt and config from database
        const extractionPrompt = await getExtractionPrompt()
        const agentConfig = await getInvoiceAgentConfig()

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${agentConfig.model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: extractionPrompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: imageData
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: agentConfig.temperature,
                        maxOutputTokens: 2048,
                    }
                })
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Gemini Vision error:', response.status, errorText)
            return NextResponse.json({ error: 'Failed to process invoice' }, { status: 500 })
        }

        const data = await response.json()
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        // Parse JSON from response (handle potential markdown wrapping)
        let extractedData
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                extractedData = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('No JSON found in response')
            }
        } catch (parseError) {
            console.error('Failed to parse extraction:', responseText)
            return NextResponse.json({ error: 'Failed to parse invoice data' }, { status: 500 })
        }

        // Return extracted data for user approval (don't save yet)
        return NextResponse.json({
            success: true,
            extracted: extractedData,
            needsApproval: true
        })

    } catch (error: any) {
        console.error('Invoice extraction error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
