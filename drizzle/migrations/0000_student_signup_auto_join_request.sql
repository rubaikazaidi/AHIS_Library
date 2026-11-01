CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text;
  _org uuid;
  _age int;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';
  IF requested_role = 'librarian' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'librarian');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
    BEGIN _org := (NEW.raw_user_meta_data->>'organization_id')::uuid; EXCEPTION WHEN others THEN _org := NULL; END;
    BEGIN _age := (NEW.raw_user_meta_data->>'age')::int; EXCEPTION WHEN others THEN _age := NULL; END;
    INSERT INTO public.profiles (id, full_name, email, grade, age, gr_number, organization_id)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.email,
            NULLIF(NEW.raw_user_meta_data->>'grade',''), _age, NULLIF(NEW.raw_user_meta_data->>'gr_number',''), NULL)
    ON CONFLICT (id) DO NOTHING;
    IF _org IS NOT NULL AND EXISTS (SELECT 1 FROM public.organizations WHERE id = _org) THEN
      INSERT INTO public.organization_join_requests (user_id, organization_id, full_name, email, grade, age, gr_number, account_created_at)
      VALUES (NEW.id, _org, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.email,
              NULLIF(NEW.raw_user_meta_data->>'grade',''), _age, NULLIF(NEW.raw_user_meta_data->>'gr_number',''), NEW.created_at);
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Backfill the dummy student account
INSERT INTO public.profiles (id, full_name, email)
VALUES ('8ba80836-013d-4c26-a0e1-986b6f1cc2ac', 'Rubaika Zaidi', 'rubaika.zaidi@outlook.com')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.organization_join_requests (user_id, organization_id, full_name, email)
SELECT '8ba80836-013d-4c26-a0e1-986b6f1cc2ac', 'c01f9027-9f42-40f0-83fb-4384943d79b1', 'Rubaika Zaidi', 'rubaika.zaidi@outlook.com'
WHERE NOT EXISTS (SELECT 1 FROM public.organization_join_requests WHERE user_id='8ba80836-013d-4c26-a0e1-986b6f1cc2ac');