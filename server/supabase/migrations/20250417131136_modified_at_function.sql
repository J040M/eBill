---- Function ----
-- Update function to be on updates
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at := now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_modified_at ON public.ebills;
DROP TRIGGER IF EXISTS trg_update_modified_at ON public.suppliers;
DROP TRIGGER IF EXISTS trg_update_modified_at ON public.roles;
DROP TRIGGER IF EXISTS trg_update_modified_at ON public.permissions;

---- TRIGGERS ----
-- Ebills 
CREATE TRIGGER trg_update_modified_at
BEFORE UPDATE ON public.ebills
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();
-- Suppliers 
CREATE TRIGGER trg_update_modified_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();
-- Roles
CREATE TRIGGER trg_update_modified_at
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();
-- Permissions
CREATE TRIGGER trg_update_modified_at
BEFORE UPDATE ON public.permissions
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();