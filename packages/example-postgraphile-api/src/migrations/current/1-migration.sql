CREATE EXTENSION IF NOT EXISTS citext;

--!include functions/trigger--update-datetime.sql

DROP TABLE IF EXISTS public.thing;

CREATE TABLE public.thing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_datetime timestamptz,
    modified_datetime timestamptz DEFAULT now(),
    name citext,
    description tsvector
);

CREATE OR REPLACE TRIGGER _100_modify_datetime
BEFORE INSERT OR UPDATE ON public.thing
FOR EACH ROW EXECUTE PROCEDURE public.trigger__update_datetime();
