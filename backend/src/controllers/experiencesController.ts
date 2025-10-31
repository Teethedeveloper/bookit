import { supabase } from "../integrations/supabase";

export const getExperiences = async () => {
  // Return experiences ordered by rating (descending) to match frontend expectations
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("rating", { ascending: false });

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

export const getSlotsByExperience = async (experienceId: string) => {
  const { data, error } = await supabase
    .from("slots")
    .select("*")
    .eq("experience_id", experienceId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;
  return data;
};

