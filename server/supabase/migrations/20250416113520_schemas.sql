DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_namespace WHERE nspname = 'auth'
    ) THEN
        EXECUTE 'CREATE SCHEMA auth';
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_namespace WHERE nspname = 'public'
    ) THEN
        EXECUTE 'CREATE SCHEMA public';
    END IF;
END
$$;