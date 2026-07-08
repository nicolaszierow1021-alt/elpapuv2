-- Run this script in your Supabase SQL Editor

-- 1. Create movies table
CREATE TABLE IF NOT EXISTS public.movies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tmdb_id bigint UNIQUE,
  title text NOT NULL,
  original_title text,
  release_year integer,
  resolution text,
  format text,
  audio_languages text[],
  subtitles text[],
  duration_minutes integer,
  file_size text,
  password text DEFAULT 'www.papumovie.com',
  rating numeric(3, 1),
  description text,
  cover_url text,
  backdrop_url text,
  trailer_url text,
  genres text[],
  links_vip jsonb DEFAULT '[]'::jsonb,
  links_free jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Create cast_members table
CREATE TABLE IF NOT EXISTS public.cast_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id uuid REFERENCES public.movies(id) ON DELETE CASCADE,
  name text NOT NULL,
  character_name text,
  photo_url text,
  role text NOT NULL, -- e.g., 'Director', 'Actor'
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Create screenshots table
CREATE TABLE IF NOT EXISTS public.screenshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id uuid REFERENCES public.movies(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Turn on Row Level Security
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cast_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cast_members" ON public.cast_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access on screenshots" ON public.screenshots FOR SELECT USING (true);

-- Ensure service_role has full access (this is default but good to be explicit if RLS is on and they use API)
-- Authenticated admins would need different policies, but we will use the service_role key in the Next.js API for admin actions.

-- 4. Create profiles table for user accounts
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'user', -- 'admin', 'user', 'vip'
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone (for usernames)
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Users can update their own profile
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );
