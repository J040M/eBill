import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Ebill } from 'src/types';

@Injectable()
export class EbillService {
    constructor(private readonly supabaseClient: SupabaseClient) { }

    async create(ebill: Ebill): Promise<Ebill[]> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .insert(ebill)
            .select()
        if (error) throw new Error(error.message)
        return data
    }

    async findOneById(uuid: string): Promise<Ebill> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .select('*')
            .eq('uuid', uuid)
            .single()
        if (error) throw new Error(error.message)
        return data
    }

    async findAll(): Promise<Ebill[]> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .select('*')
        if (error) throw new Error(error.message)
        return data
    }

    async update(ebill: Ebill): Promise<Ebill[]> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .update(ebill)
            .eq('uuid', ebill.uuid)
            .select()
        if (error) throw new Error(error.message)
        return data
    }

    async archiveEbill(uuid: string): Promise<void> {
        const { error } = await this.supabaseClient
            .from('ebills')
            .update({ archived: true })
            .eq('uuid', uuid)

        if (error) throw new Error(error.message)
    }

    async searchByNumber(number: string): Promise<Ebill[]> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .select('*')
            .ilike('eb_number', `%${number}%`)

        if (error) throw new Error(error.message)
        return data
    }

    async searchByDate(date: Date): Promise<Ebill[]> {
        const { data, error } = await this.supabaseClient
            .from('ebills')
            .select('*')
            .eq('eb_date', date)

        if (error) throw new Error(error.message)
        return data
    }
}
