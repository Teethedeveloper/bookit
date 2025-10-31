import { supabase } from "../integrations/supabase";

export const getExperiences = async () => {
  const { data, error } = await supabase
    .from("experiences")
    .select("*");
  
  if (error) throw error;
  return data;
};

export const getExperienceById = async (id: string) => {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

