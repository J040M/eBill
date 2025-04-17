CREATE TABLE IF NOT EXISTS public.roles_permissions (
    uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fk_role UUID NOT NULL REFERENCES roles(uuid),
    fk_permission UUID NOT NULL REFERENCES permissions(uuid)
    created_at TIMESTAMP DEFAULT now(),
    modified_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL
);