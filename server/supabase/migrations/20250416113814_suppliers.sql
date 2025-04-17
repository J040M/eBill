CREATE TABLE IF NOT EXISTS public.suppliers (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact JSON,
    internal_id VARCHAR(255),
    tax_id VARCHAR(255),
    bank_info JSON,
    created_at TIMESTAMP DEFAULT now(),
    modified_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL
);