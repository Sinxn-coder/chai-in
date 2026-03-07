-- SQL to Create a Single Test User Only
-- Run this in your Supabase SQL Editor to create a valid user profile.

DO $$ 
DECLARE 
    test_id uuid := '00000000-0000-0000-0000-000000000001'; -- Fixed Test ID
    test_email text := 'testuser@example.com';
BEGIN
    -- 1. Insert into auth.users (Supabase Internal Auth)
    -- This allows the user to exist in the system.
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, last_sign_in_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000', test_id, 'authenticated', 'authenticated', test_email, 
        crypt('password123', gen_salt('bf')), -- Dummy password
        now(), now(),
        '{"provider": "email", "providers": ["email"]}', 
        '{"full_name": "Test User", "avatar_url": "assets/images/icon.png"}', 
        now(), now(), '', '', '', ''
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. Insert into public.users (Your App Profile Table)
    -- This enables foreign key relationships (like for spots or reviews).
    INSERT INTO public.users (id, email, full_name, username, avatar_url, city, is_admin)
    VALUES (
        test_id, 
        test_email, 
        'Test User', 
        'testuser', 
        'assets/images/icon.png', 
        'Kochi', 
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        username = EXCLUDED.username,
        is_admin = EXCLUDED.is_admin;

    RAISE NOTICE 'SUCCESS: Test user created with ID: %', test_id;
END $$;
