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
