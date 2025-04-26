import { Ollama } from 'ollama'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ebillSchema } from '../schemas/schema_0.js'
import type { Ebill, ollamaConfig } from '../types'

async function ollamaWorker(config: ollamaConfig, content: string): Promise<Partial<Ebill>> {
    console.log(`Starting Ollama worker`)
    const ollama = new Ollama({ host: config.url })
    try {
        const result = await ollama.chat({
            model: config.model,
            messages: [
                {
                    role: 'system', content: '\
                    The output must match this structure exactly: \
                    {"items": { \
                    "label": string, \
                    "quantity": number (only numbers), \
                    "price_unit": number (only numbers) }[] \
                    "bill_number": string, \
                    "issue_date": date (ISO format: YYYY-MM-DD), \
                    "due_date": date (ISO format: YYYY-MM-DD) / if not found use the issue_date, \
                    "supplier": string, \
                    "tax": {"label": string, "value": number }[], \
                    "total": number (only numbers) } \
                    Do not include any other text or commentary. Do not explain your reasoning. \
                    Just return a clean JSON object in the format above.' },
                { 
                    role: 'user', content 
                }
            ],
            format: zodToJsonSchema(ebillSchema),
        })

        const parsed = JSON.parse(result.message.content)

        parsed.issue_date = new Date(parsed.issue_date)
        parsed.due_date = new Date(parsed.due_date)

        const parsedResult = ebillSchema.parse(parsed)

        return parsedResult as unknown as Partial<Ebill>
    } catch (error) {
        console.error('Error in Ollama worker:', error)
        throw error
    }
}

export default ollamaWorker
