'use server'

import pool from '@/lib/db'
import { cookies } from 'next/headers'

// Get company ID from session
// IMPORTANT: clinicId is the stable client_id, companyId is the active company row (changes with versioning)
async function getCompanyIdFromSession(): Promise<{ companyId: number; clinicId: string } | null> {
    const cookieStore = await cookies()
    const clientIdStr = cookieStore.get('alma_client_id')?.value

    if (!clientIdStr) {
        return null
    }

    const client = await pool.connect()
    try {
        const result = await client.query(
            'SELECT id FROM companies WHERE client_id = $1 AND is_active = TRUE',
            [clientIdStr]
        )
        if (result.rows.length === 0) {
            return null
        }
        const companyId = result.rows[0].id
        // Use client_id as the stable clinicId (doesn't change with versioning)
        return { companyId, clinicId: String(clientIdStr) }
    } finally {
        client.release()
    }
}

// Get current agent configuration
export async function getAgentConfig() {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const client = await pool.connect()
    try {
        // Get company settings
        const companyResult = await client.query(
            'SELECT name, language, personality, temperature FROM companies WHERE id = $1 AND is_active = TRUE',
            [session.companyId]
        )

        // Get active agent config (only is_active = true)
        const agentResult = await client.query(
            'SELECT agent_name, model_name, temperature, voice_settings FROM agent_configurations WHERE company_id = $1 AND is_active = TRUE ORDER BY created_at DESC LIMIT 1',
            [session.companyId]
        )

        const company = companyResult.rows[0] || {}
        const agent = agentResult.rows[0] || {}

        return {
            success: true,
            config: {
                companyName: company.name || '',
                language: company.language || 'English',
                personality: company.personality || 'friendly',
                temperature: agent.temperature || company.temperature || 0.6,
                agentName: agent.agent_name || `${company.name} Agent`,
                modelName: agent.model_name || 'gemini-2.5-flash-native-audio-preview-12-2025',
            }
        }
    } finally {
        client.release()
    }
}

// Personality to temperature mapping
const personalityTemperature: Record<string, number> = {
    professional: 0.3,
    friendly: 0.6,
    empathetic: 0.9
}

// Update agent configuration (creates new version, deactivates old)
export async function updateAgentConfig(config: {
    language: string
    personality: string
    agentName: string
}) {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    // Calculate temperature from personality
    const temperature = personalityTemperature[config.personality] || 0.6

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        // Update company settings
        await client.query(
            'UPDATE companies SET language = $1, personality = $2, temperature = $3 WHERE id = $4 AND is_active = TRUE',
            [config.language, config.personality, temperature, session.companyId]
        )

        // Create voice_settings based on language
        const languageCode = config.language === 'French' ? 'fr-CA' : 'en-US'
        const voiceSettings = JSON.stringify({ language_code: languageCode })

        // Deactivate all existing agent configurations for this company
        await client.query(
            'UPDATE agent_configurations SET is_active = FALSE WHERE company_id = $1',
            [session.companyId]
        )

        // Insert new active agent configuration
        await client.query(
            `INSERT INTO agent_configurations (clinic_id, agent_name, company_id, model_name, temperature, voice_settings, is_active, created_at)
             VALUES ($1, $2, $3, 'gemini-2.5-flash-native-audio-preview-12-2025', $4, $5, TRUE, NOW())`,
            [session.clinicId, config.agentName, session.companyId, temperature, voiceSettings]
        )

        await client.query('COMMIT')
        return { success: true }
    } catch (error: any) {
        await client.query('ROLLBACK')
        console.error('Error updating agent config:', error)
        return { error: error.message || 'Failed to update configuration' }
    } finally {
        client.release()
    }
}

// Get company knowledge documents
export async function getCompanyKnowledge() {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const client = await pool.connect()
    try {
        // Only get active (not soft-deleted) documents
        const result = await client.query(
            'SELECT id, file_name, created_at FROM company_knowledge WHERE company_id = $1 AND (is_active IS NULL OR is_active = TRUE) ORDER BY created_at DESC',
            [session.companyId]
        )
        return { success: true, documents: result.rows }
    } finally {
        client.release()
    }
}

// Add new company knowledge document with OCR
export async function addCompanyKnowledge(file: { name: string; base64: string; fileType: string }) {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const client = await pool.connect()
    try {
        let extractedText = ''
        const mistralApiKey = process.env.MISTRAL_API_KEY

        // OCR processing - matching working Python implementation
        // Images: use image_url with base64 data URL directly
        // PDFs: upload file → get signed URL → use document_url
        console.log('=== OCR Processing Started ===')
        console.log('File:', file.name, 'Type:', file.fileType)
        console.log('MISTRAL_API_KEY present:', !!mistralApiKey)
        console.log('Base64 length:', file.base64?.length || 0)

        if (mistralApiKey && file.base64) {
            const isPdf = file.fileType.includes('pdf')
            console.log('Document type:', isPdf ? 'PDF' : 'Image')

            try {
                if (isPdf) {
                    // PDF: upload → signed URL → OCR
                    console.log('Step 1: Uploading PDF...')
                    const binaryData = Buffer.from(file.base64, 'base64')
                    const blob = new Blob([binaryData], { type: 'application/pdf' })

                    const formData = new FormData()
                    formData.append('purpose', 'ocr')
                    formData.append('file', blob, file.name)

                    const uploadRes = await fetch('https://api.mistral.ai/v1/files', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${mistralApiKey}` },
                        body: formData
                    })
                    console.log('Upload status:', uploadRes.status)
                    const uploadData = await uploadRes.json()
                    console.log('Upload result:', JSON.stringify(uploadData).substring(0, 200))

                    if (!uploadRes.ok) throw new Error('Upload failed: ' + JSON.stringify(uploadData))

                    const fileId = uploadData.id
                    console.log('Step 2: Getting signed URL for file:', fileId)

                    const signedRes = await fetch(`https://api.mistral.ai/v1/files/${fileId}/url`, {
                        headers: { 'Authorization': `Bearer ${mistralApiKey}` }
                    })
                    const signedData = await signedRes.json()
                    console.log('Signed URL result:', JSON.stringify(signedData).substring(0, 200))

                    if (!signedRes.ok) throw new Error('Signed URL failed')

                    console.log('Step 3: Calling OCR...')
                    const ocrRes = await fetch('https://api.mistral.ai/v1/ocr', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${mistralApiKey}`
                        },
                        body: JSON.stringify({
                            model: 'mistral-ocr-latest',
                            document: { type: 'document_url', document_url: signedData.url }
                        })
                    })
                    console.log('OCR status:', ocrRes.status)
                    const ocrData = await ocrRes.json()

                    if (ocrRes.ok && ocrData.pages) {
                        extractedText = ocrData.pages.map((p: any) => p.markdown || '').join('\n\n')
                    }
                } else {
                    // Image: use base64 data URL directly
                    console.log('Processing image with base64 data URL...')
                    const dataUrl = `data:${file.fileType};base64,${file.base64}`

                    const ocrRes = await fetch('https://api.mistral.ai/v1/ocr', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${mistralApiKey}`
                        },
                        body: JSON.stringify({
                            model: 'mistral-ocr-latest',
                            document: { type: 'image_url', image_url: dataUrl }
                        })
                    })
                    console.log('OCR status:', ocrRes.status)
                    const ocrText = await ocrRes.text()
                    console.log('OCR response:', ocrText.substring(0, 500))

                    if (ocrRes.ok) {
                        const ocrData = JSON.parse(ocrText)
                        if (ocrData.pages) {
                            extractedText = ocrData.pages.map((p: any) => p.markdown || '').join('\n\n')
                        }
                    } else {
                        console.error('OCR Error:', ocrRes.status, ocrText)
                    }
                }
                console.log('Extracted text length:', extractedText.length)
            } catch (ocrErr) {
                console.error('OCR Exception:', ocrErr)
            }
        } else {
            console.log('Skipping OCR - missing API key or base64 data')
        }
        console.log('=== OCR Processing Done ===')

        // Insert document with is_active = true
        await client.query(
            'INSERT INTO company_knowledge (company_id, raw_text, file_name, is_active, created_at) VALUES ($1, $2, $3, TRUE, NOW())',
            [session.companyId, extractedText || '[No text extracted]', file.name]
        )

        return { success: true }
    } catch (error: any) {
        console.error('Error adding knowledge:', error)
        return { error: error.message || 'Failed to add document' }
    } finally {
        client.release()
    }
}

// Delete company knowledge document
export async function deleteCompanyKnowledge(documentId: number) {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const client = await pool.connect()
    try {
        // Soft delete: set is_active = false instead of deleting
        await client.query(
            'UPDATE company_knowledge SET is_active = FALSE WHERE id = $1 AND company_id = $2',
            [documentId, session.companyId]
        )
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting knowledge:', error)
        return { error: error.message || 'Failed to delete document' }
    } finally {
        client.release()
    }
}

// Get company info
export async function getCompanyInfo() {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const client = await pool.connect()
    try {
        const result = await client.query(
            'SELECT name, description, service_type, size as company_size, language, personality FROM companies WHERE id = $1 AND is_active = TRUE',
            [session.companyId]
        )

        if (result.rows.length === 0) {
            return { error: 'Company not found' }
        }

        return { success: true, company: result.rows[0] }
    } finally {
        client.release()
    }
}

// Update company info with history tracking
export async function updateCompanyInfo(info: {
    name: string
    description: string
    serviceType: string
    companySize: string
}) {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        // Step 1: Get current company data
        const currentResult = await client.query(
            'SELECT client_id, language, personality, temperature FROM companies WHERE id = $1 AND is_active = TRUE',
            [session.companyId]
        )

        if (currentResult.rows.length === 0) {
            throw new Error('Company not found')
        }

        const current = currentResult.rows[0]

        // Step 2: Deactivate the old row
        await client.query(
            'UPDATE companies SET is_active = FALSE WHERE id = $1',
            [session.companyId]
        )

        // Step 3: Insert new active row with updated data
        await client.query(
            `INSERT INTO companies (client_id, name, description, service_type, size, language, personality, temperature, is_active, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, NOW())`,
            [
                current.client_id,
                info.name,
                info.description,
                info.serviceType,
                info.companySize,
                current.language,
                current.personality,
                current.temperature
            ]
        )

        await client.query('COMMIT')
        return { success: true }
    } catch (error: any) {
        await client.query('ROLLBACK')
        console.error('Error updating company info:', error)
        return { error: error.message || 'Failed to update company info' }
    } finally {
        client.release()
    }
}

// Get trusted sources URLs from company_knowledge (stored as JSONB array)
export async function getTrustedSources() {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const client = await pool.connect()
    try {
        // Get trusted sources from the special row with file_name = '_trusted_sources'
        const result = await client.query(
            `SELECT trusted_sources FROM company_knowledge 
             WHERE company_id = $1 AND file_name = '_trusted_sources' AND (is_active IS NULL OR is_active = TRUE)
             LIMIT 1`,
            [session.companyId]
        )

        let sources: string[] = []
        if (result.rows[0]?.trusted_sources) {
            sources = Array.isArray(result.rows[0].trusted_sources)
                ? result.rows[0].trusted_sources
                : []
        }

        return { success: true, sources }
    } finally {
        client.release()
    }
}

// Update trusted sources URLs (stored as JSONB array in company_knowledge)
export async function updateTrustedSources(sources: string[]) {
    const session = await getCompanyIdFromSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    // Validate URLs
    const validUrls = sources.filter(url => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    })

    const client = await pool.connect()
    try {
        // Check if trusted sources row exists
        const existing = await client.query(
            `SELECT id FROM company_knowledge 
             WHERE company_id = $1 AND file_name = '_trusted_sources' AND (is_active IS NULL OR is_active = TRUE)`,
            [session.companyId]
        )

        if (existing.rows.length > 0) {
            // Update existing row
            await client.query(
                `UPDATE company_knowledge SET trusted_sources = $1 
                 WHERE company_id = $2 AND file_name = '_trusted_sources'`,
                [JSON.stringify(validUrls), session.companyId]
            )
        } else {
            // Insert new row
            await client.query(
                `INSERT INTO company_knowledge (company_id, file_name, raw_text, trusted_sources, is_active, created_at) 
                 VALUES ($1, '_trusted_sources', '', $2, TRUE, NOW())`,
                [session.companyId, JSON.stringify(validUrls)]
            )
        }

        return { success: true, sources: validUrls }
    } catch (error: any) {
        console.error('Error updating trusted sources:', error)
        return { error: error.message || 'Failed to update trusted sources' }
    } finally {
        client.release()
    }
}
