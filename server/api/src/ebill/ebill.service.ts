import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class EbillService {
    constructor(private readonly supabaseClient: SupabaseClient) { }

    async create(ebill: any): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .insert(ebill)
            .select()
        if (error) throw new Error(error.message)
        return data
    }

    async findOneById(uuid: string): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .select('*')
            .eq('uuid', uuid)
            .single()
        if (error) throw new Error(error.message)
        return data
    }

    async findAll(): Promise<any[]> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .select('*')
        if (error) throw new Error(error.message)
        return data
    }

    async update(uuid: string, ebill: any): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .update(ebill)
            .eq('uuid', uuid)
            .select()
        if (error) throw new Error(error.message)
        return data
    }

    async archiveEbill(uuid: string): Promise<any> {
        const { error } = await this.supabaseClient
            .from('ebills')
            .update({ archived: true })
            .eq('uuid', uuid)

        if (error) throw new Error(error.message)
    }
}
