DROP FUNCTION IF EXISTS public.trigger__update_datetime CASCADE;

-- Ensure `created_datetime` is unchanged and `modified_datetime` increases monotonically
CREATE OR REPLACE FUNCTION public.trigger__update_datetime()
RETURNS trigger AS $$
BEGIN
    NEW.created_datetime = (CASE WHEN TG_OP = 'INSERT'
        THEN NOW()
        ELSE OLD.created_datetime
    END);

    NEW.modified_datetime = (CASE WHEN TG_OP = 'UPDATE' AND OLD.modified_datetime >= NOW()
        THEN OLD.modified_datetime + interval '1 millisecond'
        ELSE NOW()
    END);

    return NEW;
END;
$$ LANGUAGE plpgsql VOLATILE SET search_path TO pg_catalog,
pg_temp,
public;

COMMENT ON FUNCTION public.trigger__update_datetime() IS
E'This trigger should be called on all tables with `created_datetime` and `modified_datetime` columns. It ensures that the date columns cannot be manipulated and that the `update_datetime` increases  monotonically.'; -- noqa: LT05
