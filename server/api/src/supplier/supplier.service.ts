import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupplierService {
    constructor(private readonly supabaseClient: SupabaseClient) {}

    async create(supplier: Supplier): Promise<Supplier[]> {
        const { data, error } = await this.supabaseClient
            .from('suppliers')
            .insert(supplier)
            .select()
        if (error) throw new Error(error.message)
        return data
    }

    async findOneById(uuid: string): Promise<Supplier> {
        const { data, error } = await this.supabaseClient
            .from('suppliers')
            .select('*')
            .eq('uuid', uuid)
            .single()
        if (error) throw new Error(error.message)
        return data
    }

    async findAll(): Promise<Supplier[]> {
        const { data, error } = await this.supabaseClient
            .from('suppliers')
            .select('*')
        if (error) throw new Error(error.message)
        return data
    }

    async update(uuid: string, supplier: Supplier): Promise<Supplier[]> {
        const { data, error } = await this.supabaseClient
            .from('suppliers')
            .update(supplier)
            .eq('uuid', uuid)
            .select()
        if (error) throw new Error(error.message)
        return data
    }

    async archiveSupplier(uuid: string): Promise<void> { 
        const { error } = await this.supabaseClient
            .from('suppliers')
            .update({ archived: true })
            .eq('uuid', uuid)

        if (error) throw new Error(error.message)
    }
}
