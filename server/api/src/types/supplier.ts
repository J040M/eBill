interface SupplierDatabase {
    uuid: string;
    name: string;
    contact: {
        phone_number?: string;
        email?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postal_code?: string;
    };
    internal_id?: string;
    tax_id?: string;
    bank_info?: {
        account_number?: string;
        bank_name?: string;
        iban?: string;
        swift_code?: string;
    };
    created_at: Date;
    modified_at: Date;
}