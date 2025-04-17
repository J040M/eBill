export const schema = {
    type: "object",
    properties: {
        items: {
            type: "array",
            properties: {
                item_label: { type: "string" },
                item_quantity: { type: "string" },
                item_price_unit: { type: "string" },
                item_price_total: { type: "string" }
            },
            required: ["item_name", "item_value", "item_price", "item_price_total"],
        },
        bill_number: { type: "string" },
        issued_date: { type: "string" },
        due_date: { type: "string" },
        seller: { type: "string" },
        taxes: { type: "string" },
        total: { type: "string" },
    },
    required: ["items", "bill_number", "issue_date", "due_date", "seller", "taxes", "total"],
    additionalProperties: false
}

export interface Ebill {
    uuid?: string;
    contents: Record<string, any>;
    eb_number: string;
    eb_date: Date;
    eb_due_date: Date;
    eb_supplier: string;
    eb_items: any[];
    eb_taxes: number;
    eb_total: number;
    created_at?: Date;
    modified_at?: Date;
}
