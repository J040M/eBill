interface Ebill {
    uuid: string;
    contents: Record<string, any>;
    eb_number: string;
    eb_date: Date;
    eb_due_date: Date;
    eb_supplier: string;
    eb_items: any[];
    eb_taxes: number;
    eb_total: number;
    created_at: Date;
    modified_at: Date;
}