'use server'

import pool from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Personality to temperature mapping (hidden from user)
const personalityConfig: Record<string, { temperature: number; promptModule: string }> = {
    professional: {
        temperature: 0.3,
        promptModule: `You are a professional medical receptionist. Maintain a formal, efficient tone. Be precise and concise. Focus on handling appointments and inquiries with clarity and professionalism.`
    },
    friendly: {
        temperature: 0.6,
        promptModule: `You are a friendly medical receptionist. Greet callers warmly and maintain a conversational tone. Be approachable and personable while efficiently handling their needs.`
    },
    empathetic: {
        temperature: 0.9,
        promptModule: `You are a caring, empathetic medical receptionist. Show genuine concern for patients' wellbeing. Be patient, understanding, and supportive while handling their requests.`
    }
}

interface PersonalInfo {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
}

interface CompanyInfo {
    name: string
    serviceType: string
    size: string
    regions: string
    description: string
}

interface AgentSettings {
    language: string
    personality: 'professional' | 'friendly' | 'empathetic'
}

interface OnboardingData {
    personalInfo: PersonalInfo
    companyInfo: CompanyInfo
    agentSettings: AgentSettings
    uploadedFiles: { name: string; base64: string; fileType: string }[]
}

export async function completeOnboardingWithData(data: OnboardingData): Promise<{ success: boolean; error?: string; clientId?: number }> {
    console.log('=== ONBOARDING START ===')
    console.log('Database URL prefix:', process.env.DATABASE_URL?.substring(0, 30))

    let client
    try {
        client = await pool.connect()
        console.log('Database connected successfully')
    } catch (connErr) {
        console.error('DATABASE CONNECTION FAILED:', connErr)
        return { success: false, error: 'Could not connect to database. Please try again.' }
    }

    try {
        // Start transaction
        await client.query('BEGIN')
        console.log('Transaction started')

        // 1. Create client
        const passwordHash = Buffer.from(data.personalInfo.password).toString('base64')
        console.log('Inserting client:', data.personalInfo.email)

        const clientResult = await client.query(
            `INSERT INTO clients (first_name, last_name, email, password_hash, phone)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [data.personalInfo.firstName, data.personalInfo.lastName, data.personalInfo.email, passwordHash, data.personalInfo.phone]
        )
        const clientId = clientResult.rows[0].id
        console.log('Client created with ID:', clientId)

        // 2. Create company
        const config = personalityConfig[data.agentSettings.personality]

        const companyResult = await client.query(
            `INSERT INTO companies (
                client_id, name, service_type, size, regions, description,
                language, personality, temperature, prompt_module,
                uploaded_documents
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING id`,
            [
                clientId,
                data.companyInfo.name,
                data.companyInfo.serviceType,
                data.companyInfo.size,
                data.companyInfo.regions,
                data.companyInfo.description,
                data.agentSettings.language,
                data.agentSettings.personality,
                config.temperature,
                'dynamic',
                JSON.stringify([])
            ]
        )
        const companyId = companyResult.rows[0].id
        const clinicId = String(companyId) // Use companyId as clinic_id for consistency
        console.log('Company created with ID:', companyId)

        // 3. Process Documents & Build Knowledge Base (optional - don't fail if OCR fails)
        const mistralApiKey = process.env.MISTRAL_API_KEY
        let allOcrText = ''

        if (data.uploadedFiles.length > 0 && mistralApiKey) {
            console.log(`Processing ${data.uploadedFiles.length} files...`)
            for (const file of data.uploadedFiles) {
                let extractedText = ''

                try {
                    const response = await fetch('https://api.mistral.ai/v1/ocr', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${mistralApiKey}`
                        },
                        body: JSON.stringify({
                            model: 'mistral-ocr-latest',
                            document: {
                                type: file.fileType.includes('pdf') ? 'pdf' : 'image',
                                data: file.base64
                            }
                        })
                    })

                    if (response.ok) {
                        const ocrResult = await response.json()
                        if (ocrResult.pages) {
                            extractedText = ocrResult.pages.map((p: any) => p.markdown || p.text || '').join('\n\n')
                        }
                        console.log(`OCR success for ${file.name}`)
                    }
                } catch (ocrErr) {
                    console.error(`OCR failed for ${file.name}:`, ocrErr)
                }

                // Insert into company_knowledge (even if OCR failed, record the file)
                await client.query(
                    `INSERT INTO company_knowledge (company_id, raw_text, file_name) VALUES ($1, $2, $3)`,
                    [companyId, extractedText || '[Processing failed]', file.name]
                )
                allOcrText += `\n\n--- Document: ${file.name} ---\n${extractedText}`
            }
        }

        // NOTE: Prompts are handled by global templates with placeholders
        // The voice agent fills in {{company_name}}, {{agent_name}}, etc. at runtime
        // from the companies, agent_configurations, and company_knowledge tables

        // 5. Create Agent Configuration with voice_settings
        const languageCode = data.agentSettings.language === 'French' ? 'fr-CA' : 'en-US'
        const voiceSettings = JSON.stringify({ language_code: languageCode })

        await client.query(
            `INSERT INTO agent_configurations (clinic_id, agent_name, company_id, model_name, temperature, voice_settings, created_at)
             VALUES ($1, $2, $3, 'gemini-2.5-flash-native-audio-preview-12-2025', $4, $5, NOW())`,
            [clinicId, `${data.companyInfo.name} Agent`, companyId, config.temperature, voiceSettings]
        )

        // COMMIT the transaction
        await client.query('COMMIT')
        console.log('=== TRANSACTION COMMITTED ===')
        console.log(`ClientID: ${clientId}, CompanyID: ${companyId}`)

        // Return success with clientId so we can set cookies client-side
        return { success: true, clientId: clientId }

    } catch (error: any) {
        // ROLLBACK on any error
        await client.query('ROLLBACK')
        console.error('=== TRANSACTION ROLLED BACK ===')
        console.error('Error:', error)

        if (error.code === '23505') {
            return { success: false, error: 'This email is already registered. Please log in instead.' }
        }

        return { success: false, error: `Database error: ${error.message || 'Unknown error'}` }
    } finally {
        client.release()
    }
}
