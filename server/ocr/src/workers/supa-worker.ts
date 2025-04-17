import { createClient } from '@supabase/supabase-js'
import type { Ebill } from '../schemas/schema_0'

async function supaWorker(config: supaConfig, ebill: Ebill): Promise<void> {
    console.log(`Starting Supabase worker`)

    const supabase = createClient(config.url, config.apiKey)
    const { error } = await supabase.from('ebills').insert([ebill])

    if (error) throw new Error(error.message)
}

export default supaWorker