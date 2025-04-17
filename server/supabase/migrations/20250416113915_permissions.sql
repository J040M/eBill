CREATE TABLE IF NOT EXISTS public.permissions (
    uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    permission VARCHAR(255) NOT NULL
    created_at TIMESTAMP DEFAULT now(),
    modified_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL
);