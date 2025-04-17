import { Ollama } from 'ollama'
import { schema, Ebill } from '../schemas/schema_0.js'

async function ollamaWorker(config: ollamaConfig, content: string): Promise<Ebill> {
    console.log(`Starting Ollama worker`)
    const ollama = new Ollama({ host: config.url })
    const result = await ollama.chat({
        model: config.model,
        messages: [
            { role: 'system', content: '\
                You are a helpful assistant that receives data and structures it in the form of a receipt/bill. \
                Validate every data to the correct field. \
                taxes: "TAX/VAT/Steuer" (must be a number) \
                total: "Total/Summe/Amount", (must be a number)) \
                bill_date: "Datum/Date" (must be in date format dd-mm-yyyy) \
                bill_due_date: "Fälligkeitsdatum"/"Due date" (must be in date format dd-mm-yyyy) \
                ' },
            { role: 'user', content }
        ],
        format: schema
    })

    console.log(result.message)

    if (result.message) {
        console.error('Error processing data:', result)
        throw new Error("Error processing ChatMessage")
    }

    console.log('Terminating Ollama worker...')
    return result.message
}

export default ollamaWorker