export interface Options {
    apiUrl: string;
    accessToken?: string;
    refreshToken?: string;
}

export interface Ebill {
    uuid?: string;
    items: {
        label: string;
        quantity: number;
        price_unit: number;
    }[];
    bill_number: string;
    issue_date: Date;
    due_date: Date;
    supplier?: string;
    supplier_label: string;
    tax: {
        label: string;
        value: number;
    }[];
    total: number;
    created_at?: Date;
    modified_at?: Date;
}

export interface Supplier {
    uuid: string;
    name: string;
    contact?: {
        phone_number: string;
        email: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    };
    internal_id?: string;
    tax_id?: string;
    bank_info?: {
        account_number: string;
        bank_name: string;
        iban: string;
        swift_code: string;
    };
    created_at: Date;
    modified_at: Date;
}

export interface User {
    id: string,
    email: string,
}
