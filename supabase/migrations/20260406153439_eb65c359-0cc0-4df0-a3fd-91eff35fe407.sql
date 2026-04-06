
-- Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- CMS Hero
CREATE TABLE public.cms_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL DEFAULT 'Premium Mineral Processing Solutions',
  subtitle TEXT,
  cta_text TEXT DEFAULT 'Request a Quote',
  cta_link TEXT DEFAULT '/contact',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_hero" ON public.cms_hero FOR SELECT USING (true);
CREATE POLICY "Admin write cms_hero" ON public.cms_hero FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_hero_updated_at BEFORE UPDATE ON public.cms_hero FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS Stats
CREATE TABLE public.cms_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_stats" ON public.cms_stats FOR SELECT USING (true);
CREATE POLICY "Admin write cms_stats" ON public.cms_stats FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_stats_updated_at BEFORE UPDATE ON public.cms_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS Products
CREATE TABLE public.cms_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  slug TEXT UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_products" ON public.cms_products FOR SELECT USING (true);
CREATE POLICY "Admin write cms_products" ON public.cms_products FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_products_updated_at BEFORE UPDATE ON public.cms_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS Testimonials
CREATE TABLE public.cms_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  text TEXT NOT NULL,
  rating INT DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_testimonials" ON public.cms_testimonials FOR SELECT USING (true);
CREATE POLICY "Admin write cms_testimonials" ON public.cms_testimonials FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_testimonials_updated_at BEFORE UPDATE ON public.cms_testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS FAQs
CREATE TABLE public.cms_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_faqs" ON public.cms_faqs FOR SELECT USING (true);
CREATE POLICY "Admin write cms_faqs" ON public.cms_faqs FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_faqs_updated_at BEFORE UPDATE ON public.cms_faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS CTA
CREATE TABLE public.cms_cta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL DEFAULT 'Ready to Get Started?',
  description TEXT,
  button_text TEXT DEFAULT 'Request a Quote',
  button_link TEXT DEFAULT '/contact',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_cta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_cta" ON public.cms_cta FOR SELECT USING (true);
CREATE POLICY "Admin write cms_cta" ON public.cms_cta FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_cta_updated_at BEFORE UPDATE ON public.cms_cta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
