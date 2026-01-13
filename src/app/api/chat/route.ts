import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

// Default fallback prompt if none found in database
const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant for {{company_name}}. You ONLY answer questions related to this company and its operations.

**Rules:**
- If a question is NOT about the company or its business, politely decline
- Be concise, professional, and helpful
- If you don't have information, say so honestly

{{#if trusted_sources}}
**Trusted External Sources:**
{{trusted_sources}}
{{/if}}

{{#if company_knowledge}}
**Company Knowledge Base:**
{{company_knowledge}}
{{/if}}`

// Fetch prompt from prompt_modules table
async function getSystemPromptFromDB(): Promise<string> {
    const client = await pool.connect()
    try {
        const result = await client.query(
            `SELECT content FROM prompt_modules 
             WHERE clinic_id = 'chat-general' AND slug = 'general-prompt' AND is_active = TRUE 
             LIMIT 1`
        )
        return result.rows[0]?.content || DEFAULT_SYSTEM_PROMPT
    } finally {
        client.release()
    }
}

async function getCompanyContext(companyId: number) {
    const client = await pool.connect()
    try {
        // Get company info - all relevant fields
        const companyRes = await client.query(
            `SELECT name, description, size, service_type, regions, language 
             FROM companies WHERE id = $1 AND is_active = TRUE`,
            [companyId]
        )

        // Get all active company knowledge (excluding trusted sources row)
        const knowledgeRes = await client.query(
            `SELECT raw_text, file_name FROM company_knowledge 
             WHERE company_id = $1 AND (is_active IS NULL OR is_active = TRUE) 
             AND file_name != '_trusted_sources'`,
            [companyId]
        )

        // Get trusted sources (stored as JSONB array in _trusted_sources row)
        const trustedSourcesRes = await client.query(
            `SELECT trusted_sources FROM company_knowledge 
             WHERE company_id = $1 AND file_name = '_trusted_sources' AND (is_active IS NULL OR is_active = TRUE)
             LIMIT 1`,
            [companyId]
        )

        const company = companyRes.rows[0] || {}
        const documents = knowledgeRes.rows || []

        // Build company info text
        const companyInfoParts: string[] = []
        if (company.name) companyInfoParts.push(`**Company Name:** ${company.name}`)
        if (company.description) companyInfoParts.push(`**Description:** ${company.description}`)
        if (company.size) companyInfoParts.push(`**Company Size:** ${company.size}`)
        if (company.service_type) companyInfoParts.push(`**Service Type:** ${company.service_type}`)
        if (company.regions) companyInfoParts.push(`**Regions:** ${company.regions}`)
        if (company.language) companyInfoParts.push(`**Language:** ${company.language}`)
        const companyInfo = companyInfoParts.join('\n')

        // Combine knowledge
        const knowledgeText = documents
            .map((doc: any) => `--- ${doc.file_name} ---\n${doc.raw_text}`)
            .join('\n\n')

        // Get trusted source URLs from JSONB column
        let trustedSources: string[] = []
        if (trustedSourcesRes.rows[0]?.trusted_sources) {
            trustedSources = Array.isArray(trustedSourcesRes.rows[0].trusted_sources)
                ? trustedSourcesRes.rows[0].trusted_sources
                : []
        }

        return {
            companyName: company.name || 'the company',
            companyInfo: companyInfo,
            knowledgeBase: knowledgeText,
            trustedSources: trustedSources
        }
    } finally {
        client.release()
    }
}

async function getCompanyIdFromSession(): Promise<number | null> {
    const cookieStore = await cookies()
    const clientIdStr = cookieStore.get('alma_client_id')?.value

    if (!clientIdStr) return null

    const client = await pool.connect()
    try {
        const result = await client.query(
            'SELECT id FROM companies WHERE client_id = $1 AND is_active = TRUE',
            [clientIdStr]
        )
        return result.rows[0]?.id || null
    } finally {
        client.release()
    }
}

export async function POST(request: NextRequest) {
    try {
        const { messages, documentContext } = await request.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
        }

        // Get company ID from session
        const companyId = await getCompanyIdFromSession()
        if (!companyId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // Get chat config from agent_configurations
        const client = await pool.connect()
        let config = { model: 'gemini-2.5-flash-lite-preview-06-17', temperature: 0.1 }

        try {
            const result = await client.query(
                `SELECT model_name, temperature FROM agent_configurations 
                 WHERE clinic_id = 'chat-general' AND is_active = TRUE 
                 ORDER BY created_at DESC LIMIT 1`
            )
            if (result.rows.length > 0) {
                config.model = result.rows[0].model_name || config.model
                config.temperature = parseFloat(result.rows[0].temperature) || config.temperature
            }
        } finally {
            client.release()
        }

        // Get company context
        const context = await getCompanyContext(companyId)

        // Fetch system prompt from database
        const promptTemplate = await getSystemPromptFromDB()

        // Build system prompt with context
        let systemPrompt = promptTemplate
            .replace(/\{\{company_name\}\}/g, context.companyName)

        // Inject company info
        if (context.companyInfo) {
            systemPrompt = systemPrompt.replace(
                /\{\{#if company_info\}\}([\s\S]*?)\{\{\/if\}\}/g,
                (_, inner) => inner.replace(/\{\{company_info\}\}/g, context.companyInfo)
            )
        } else {
            systemPrompt = systemPrompt.replace(/\{\{#if company_info\}\}[\s\S]*?\{\{\/if\}\}/g, '')
        }

        // Inject company knowledge
        if (context.knowledgeBase) {
            systemPrompt = systemPrompt.replace(
                /\{\{#if company_knowledge\}\}([\s\S]*?)\{\{\/if\}\}/g,
                (_, inner) => inner.replace(/\{\{company_knowledge\}\}/g, context.knowledgeBase)
            )
        } else {
            systemPrompt = systemPrompt.replace(/\{\{#if company_knowledge\}\}[\s\S]*?\{\{\/if\}\}/g, '')
        }

        // Inject trusted sources
        if (context.trustedSources.length > 0) {
            const sourcesText = context.trustedSources.map((url, i) => `${i + 1}. ${url}`).join('\n')
            systemPrompt = systemPrompt.replace(
                /\{\{#if trusted_sources\}\}([\s\S]*?)\{\{\/if\}\}/g,
                (_, inner) => inner.replace(/\{\{trusted_sources\}\}/g, sourcesText)
            )
        } else {
            systemPrompt = systemPrompt.replace(/\{\{#if trusted_sources\}\}[\s\S]*?\{\{\/if\}\}/g, '')
        }

        // Inject document context if present
        if (documentContext) {
            systemPrompt += `\n\n[USER DOCUMENT CONTEXT]\nThe user has uploaded a document. Here is its content which you should reference in your conversation:\n<document_content>\n${documentContext}\n</document_content>\n`
        }

        // Call Gemini API
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
        }

        // Build conversation with system instruction
        const geminiContents = messages.map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }))

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: geminiContents,
                    generationConfig: {
                        temperature: config.temperature,
                        maxOutputTokens: 2048,
                    }
                })
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Gemini API error:', response.status, errorText)
            return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 })
        }

        const data = await response.json()
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'

        return NextResponse.json({ message: assistantMessage })

    } catch (error: any) {
        console.error('Chat API error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
