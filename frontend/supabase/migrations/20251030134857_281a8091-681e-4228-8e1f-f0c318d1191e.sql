-- Create experiences table
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_reviews INTEGER DEFAULT 0,
  highlights TEXT[],
  max_slots_per_date INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create slots table
CREATE TABLE public.slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  available_slots INTEGER NOT NULL,
  total_slots INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(experience_id, date, time)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id),
  slot_id UUID NOT NULL REFERENCES public.slots(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  num_people INTEGER NOT NULL DEFAULT 1,
  promo_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create promo codes table
CREATE TABLE public.promo_codes (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access for experiences and slots
CREATE POLICY "Anyone can view experiences"
  ON public.experiences FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view slots"
  ON public.slots FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view promo codes"
  ON public.promo_codes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their bookings"
  ON public.bookings FOR SELECT
  USING (true);

-- Function to update slot availability after booking
CREATE OR REPLACE FUNCTION public.update_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.slots
  SET available_slots = available_slots - NEW.num_people
  WHERE id = NEW.slot_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically update slots
CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_slot_availability();

-- Insert sample promo codes
INSERT INTO public.promo_codes (code, discount_type, discount_value, active) VALUES
  ('SAVE10', 'percentage', 10, true),
  ('FLAT100', 'fixed', 100, true);

-- Insert sample experiences
INSERT INTO public.experiences (title, description, location, price, duration, image_url, rating, total_reviews, highlights, max_slots_per_date) VALUES
  (
    'Sunset Desert Safari Adventure',
    'Experience the magic of the desert with thrilling dune bashing, camel rides, and a traditional BBQ dinner under the stars. Perfect for adventure seekers and families alike.',
    'Dubai, UAE',
    149.99,
    '6 hours',
    'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3',
    4.8,
    342,
    ARRAY['Professional guide', 'Camel ride included', 'BBQ dinner', 'Hotel pickup'],
    15
  ),
  (
    'Northern Lights Photography Tour',
    'Chase the Aurora Borealis with expert photographers. Learn pro techniques while capturing nature''s most spectacular light show in the Arctic wilderness.',
    'Reykjavik, Iceland',
    199.99,
    '8 hours',
    'https://images.unsplash.com/photo-1483347756197-71ef80e95f73',
    4.9,
    567,
    ARRAY['Photography lessons', 'Warm drinks', 'Professional equipment', 'Small groups'],
    8
  ),
  (
    'Tokyo Street Food Walking Tour',
    'Explore hidden food markets and local eateries in Tokyo''s vibrant neighborhoods. Taste authentic Japanese cuisine and learn about culinary traditions.',
    'Tokyo, Japan',
    89.99,
    '4 hours',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    4.7,
    891,
    ARRAY['10+ food tastings', 'Local guide', 'Hidden gems', 'Vegetarian options'],
    12
  ),
  (
    'Hot Air Balloon Over Cappadocia',
    'Float above the fairy chimneys and ancient valleys of Cappadocia at sunrise. An unforgettable bucket-list experience with champagne celebration.',
    'Cappadocia, Turkey',
    249.99,
    '3 hours',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    5.0,
    1203,
    ARRAY['Sunrise flight', 'Champagne toast', 'Flight certificate', 'Hotel transfer'],
    10
  );

-- Insert sample slots for next 7 days
DO $$
DECLARE
  exp_record RECORD;
  slot_date DATE;
BEGIN
  FOR exp_record IN SELECT id, max_slots_per_date FROM public.experiences LOOP
    FOR i IN 0..6 LOOP
      slot_date := CURRENT_DATE + i;
      
      -- Morning slot
      INSERT INTO public.slots (experience_id, date, time, available_slots, total_slots)
      VALUES (exp_record.id, slot_date, '09:00 AM', exp_record.max_slots_per_date, exp_record.max_slots_per_date);
      
      -- Afternoon slot
      INSERT INTO public.slots (experience_id, date, time, available_slots, total_slots)
      VALUES (exp_record.id, slot_date, '02:00 PM', exp_record.max_slots_per_date, exp_record.max_slots_per_date);
      
      -- Evening slot
      INSERT INTO public.slots (experience_id, date, time, available_slots, total_slots)
      VALUES (exp_record.id, slot_date, '06:00 PM', exp_record.max_slots_per_date, exp_record.max_slots_per_date);
    END LOOP;
  END LOOP;
END $$;