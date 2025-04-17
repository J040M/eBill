CREATE TABLE IF NOT EXISTS public.ebills (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contents JSONB NOT NULL,
    eb_number VARCHAR(255) NOT NULL,
    eb_date DATE NOT NULL,
    eb_due_date DATE NOT NULL,
    eb_supplier UUID NOT NULL REFERENCES suppliers(uuid),
    eb_items JSON NOT NULL,
    eb_taxes SMALLINT NOT NULL,
    eb_total BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    modified_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL
) PARTITION BY RANGE (eb_date);

-- Partition for 2024
CREATE TABLE Public.ebill_2024 PARTITION OF "Public".ebill
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Partition for 2025
CREATE TABLE Public.ebill_2025 PARTITION OF "Public".ebill
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Partition for 2026
CREATE TABLE Public.ebill_2026 PARTITION OF "Public".ebill
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Partition for 2027
CREATE TABLE Public.ebill_2027 PARTITION OF "Public".ebill
    FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');