-- Add NOT NULL constraints to post_likes table
ALTER TABLE public.post_likes ALTER COLUMN post_id SET NOT NULL;
ALTER TABLE public.post_likes ALTER COLUMN user_id SET NOT NULL;

-- Add NOT NULL constraints to post_comments table
ALTER TABLE public.post_comments ALTER COLUMN post_id SET NOT NULL;
ALTER TABLE public.post_comments ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.post_comments ALTER COLUMN comment SET NOT NULL;

-- Policies for post_likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read post likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own post likes" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own post likes" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Policies for post_comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read post comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own post comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own post comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);
