import { supabase } from "@/integrations/supabase/client";

export const fetchHero = async () => {
  const { data } = await supabase.from("cms_hero").select("*").limit(1).single();
  return data;
};

export const fetchStats = async () => {
  const { data } = await supabase.from("cms_stats").select("*").order("sort_order");
  return data || [];
};

export const fetchProducts = async () => {
  const { data } = await supabase.from("cms_products").select("*").order("sort_order");
  return data || [];
};

export const fetchTestimonials = async () => {
  const { data } = await supabase.from("cms_testimonials").select("*").order("sort_order");
  return data || [];
};

export const fetchFaqs = async () => {
  const { data } = await supabase.from("cms_faqs").select("*").order("sort_order");
  return data || [];
};

export const fetchCta = async () => {
  const { data } = await supabase.from("cms_cta").select("*").limit(1).single();
  return data;
};
