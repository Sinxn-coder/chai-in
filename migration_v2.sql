-- 1. ADD USERNAME COLUMN
ALTER TABLE "public"."user_preferences" 
ADD COLUMN IF NOT EXISTS "username" text UNIQUE;

-- 2. ADMIN POLICIES FOR MODERATION
-- Allow authenticated users (Admin) to DELETE from community_posts and reviews
-- (We rely on logic checks or assume 'authenticated' = admin for this MVP context, 
--  or ideally use a specific admin role check if available)

-- Community Posts Delete
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON "public"."community_posts";
CREATE POLICY "Allow delete for authenticated users"
ON "public"."community_posts"
FOR DELETE
TO authenticated
USING (true);

-- Reviews Delete
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON "public"."reviews";
CREATE POLICY "Allow delete for authenticated users"
ON "public"."reviews"
FOR DELETE
TO authenticated
USING (true);

-- 3. ENABLE PUBLIC READ FOR ALL TABLES (If not already) to ensure search works
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."reviews";
CREATE POLICY "Enable read access for all users" ON "public"."reviews" FOR SELECT USING (true);

-- 4. BROADCAST NOTIFICATION (System Wide)
INSERT INTO "public"."notifications" ("title", "message", "is_active")
VALUES ('Action Required: Set Username', 'We have updated the app! Please set a unique username to continue.', true);
