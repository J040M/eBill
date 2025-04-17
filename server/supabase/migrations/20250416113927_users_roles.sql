CREATE TABLE IF NOT EXISTS public.users_roles (
    uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fk_user UUID NOT NULL REFERENCES auth.users(uuid) ON DELETE CASCADE,
    fk_role UUID NOT NULL REFERENCES roles(uuid) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    modified_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL
);