-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('podcasts', 'podcasts', true),
  ('thumbnails', 'thumbnails', true),
  ('avatars', 'avatars', true),
  ('clips', 'clips', true);

-- Storage policies for podcasts
CREATE POLICY "Anyone can view podcast files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'podcasts');

CREATE POLICY "Authenticated users can upload podcasts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'podcasts' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own podcasts"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'podcasts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own podcasts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'podcasts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for thumbnails
CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Broadcasters can upload thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'thumbnails' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own thumbnails"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'thumbnails' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for clips
CREATE POLICY "Anyone can view clips"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clips');

CREATE POLICY "Authenticated users can upload clips"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'clips' 
    AND auth.role() = 'authenticated'
  );

-- Enable realtime for chat
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages"
  ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;

-- Create indexes for chat performance
CREATE INDEX idx_chat_messages_channel ON public.chat_messages(channel_id, created_at DESC);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at DESC);