import { z } from 'zod'

export const ebillSchema = z.object({
    items: z.array(z.object({
        label: z.string(),
        quantity: z.number(),
        price_unit: z.number()
    })),
    bill_number: z.string(),
    issue_date: z.string(),
    due_date: z.string(),
    supplier_label: z.string(),
    tax: z.array(z.object({
        label: z.string(),
        value: z.number()
    })),
    total: z.number(),
})
