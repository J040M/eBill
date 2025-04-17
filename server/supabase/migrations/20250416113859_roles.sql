CREATE TABLE IF NOT EXISTS public.roles (
    uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role VARCHAR(255) NOT NULL
    created_at TIMESTAMP DEFAULT now(),
    modified_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL
);