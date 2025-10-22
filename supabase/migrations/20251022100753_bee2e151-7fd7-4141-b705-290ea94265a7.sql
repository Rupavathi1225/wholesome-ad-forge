-- Create ads table
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create web_results table
CREATE TABLE public.web_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view ads"
ON public.ads
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view web results"
ON public.web_results
FOR SELECT
USING (true);

-- Create policies for public write access (will secure with auth later if needed)
CREATE POLICY "Anyone can insert ads"
ON public.ads
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update ads"
ON public.ads
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete ads"
ON public.ads
FOR DELETE
USING (true);

CREATE POLICY "Anyone can insert web results"
ON public.web_results
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update web results"
ON public.web_results
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete web results"
ON public.web_results
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ads_updated_at
BEFORE UPDATE ON public.ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_web_results_updated_at
BEFORE UPDATE ON public.web_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.ads (title, description, url, image_url, is_featured) VALUES
('Natural Wellness Solutions', 'Discover holistic approaches to health and wellness with our premium natural products', 'https://example.com/wellness', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', true),
('Organic Nutrition Guide', 'Learn about clean eating and organic nutrition for a healthier lifestyle', 'https://example.com/nutrition', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', false),
('Mindfulness & Meditation', 'Transform your mental health with guided meditation and mindfulness practices', 'https://example.com/mindfulness', 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800', false),
('Yoga for Beginners', 'Start your yoga journey with easy-to-follow classes for all fitness levels', 'https://example.com/yoga', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', false),
('Herbal Remedies', 'Natural healing solutions using time-tested herbal remedies and supplements', 'https://example.com/herbal', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800', false);

INSERT INTO public.web_results (title, description, url, display_order) VALUES
('Wellness Benefits Guide', 'Complete guide to understanding the benefits of holistic wellness practices', 'https://example.com/benefits', 1),
('Healthy Living Tips', 'Daily tips and tricks for maintaining a healthy and balanced lifestyle', 'https://example.com/tips', 2),
('Natural Health Resources', 'Comprehensive resources for natural health and alternative medicine', 'https://example.com/resources', 3);