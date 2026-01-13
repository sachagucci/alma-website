import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'
import { Mistral } from '@mistralai/mistralai'

// Get company ID from session
async function getCompanyIdFromSession(): Promise<number | null> {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('alma_client_id')?.value
    if (!clientId) return null

    const client = await pool.connect()
    try {
        const result = await client.query(
            'SELECT id FROM companies WHERE client_id = $1 AND is_active = TRUE',
            [clientId]
        )
        return result.rows[0]?.id || null
    } finally {
        client.release()
    }
}

// Fetch agent config (model, temperature) from database
async function getDocumentAgentConfig(): Promise<{ model: string; temperature: number }> {
    const client = await pool.connect()
    try {
        const result = await client.query(
            `SELECT model_name, temperature FROM agent_configurations 
             WHERE clinic_id = 'document-general' AND is_active = TRUE 
             LIMIT 1`
        )
        return {
            model: result.rows[0]?.model_name || 'pixtral-large-latest',
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

        const { image, filename } = await request.json()
        if (!image) {
            return NextResponse.json({ error: 'No document provided' }, { status: 400 })
        }

        const mistralApiKey = process.env.MISTRAL_API_KEY
        if (!mistralApiKey) {
            return NextResponse.json({ error: 'Mistral API key not configured' }, { status: 500 })
        }

        // Fetch config from database
        const agentConfig = await getDocumentAgentConfig()

        // Initialize SDK
        const client = new Mistral({ apiKey: mistralApiKey })

        // Extract raw base64 and mime type
        let mimeType = 'application/pdf'
        let base64Data = image

        if (image.startsWith('data:')) {
            const matches = image.match(/^data:([^;]+);base64,(.+)$/)
            if (matches) {
                mimeType = matches[1]
                base64Data = matches[2]
            }
        } else {
            // Infer mime type from filename if valid
            if (filename?.endsWith('.png')) mimeType = 'image/png'
            else if (filename?.endsWith('.jpg') || filename?.endsWith('.jpeg')) mimeType = 'image/jpeg'
            else if (filename?.endsWith('.webp')) mimeType = 'image/webp'
        }

        // Determine request structure based on file type
        let ocrResponse;

        if (mimeType.startsWith('image/')) {
            // For images, use image_url with data URI
            ocrResponse = await client.ocr.process({
                model: agentConfig.model,
                document: {
                    type: "image_url",
                    imageUrl: image.startsWith('data:') ? image : `data:${mimeType};base64,${image}`
                }
            })
        } else {
            // For PDFs/docs, upload first then use signed URL (as per working Python example)
            // Convert base64 to File/Blob for upload
            // Node.js doesn't have File check specific Mistral upload requirements
            // The SDK usually accepts a Buffer or Stream

            const buffer = Buffer.from(base64Data, 'base64')
            const uploadedFile = await client.files.upload({
                file: {
                    fileName: filename || "document.pdf",
                    content: buffer,
                },
                purpose: "ocr"
            })

            const signedUrl = await client.files.getSignedUrl({ fileId: uploadedFile.id })

            ocrResponse = await client.ocr.process({
                model: agentConfig.model,
                document: {
                    type: "document_url",
                    documentUrl: signedUrl.url
                }
            })
        }

        // Extract content
        let extractedText = ''
        if (ocrResponse.pages) {
            extractedText = ocrResponse.pages.map((page: any) => page.markdown).join('\n\n')
        }

        return NextResponse.json({
            success: true,
            text: extractedText,
            filename: filename || 'document',
            companyId
        })

    } catch (error: any) {
        console.error('Document extraction error:', error)
        return NextResponse.json({
            error: error.message || 'Internal server error',
            details: JSON.stringify(error)
        }, { status: 500 })
    }
}
