import { supabase } from "../integrations/supabase";

export const validatePromoCode = async (code: string) => {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .eq("active", true)
    .single();

  if (error) throw error;
  return data;
};
