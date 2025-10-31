import { supabase } from "../integrations/supabase";

export const createBooking = async (bookingData: any) => {
  const { data, error } = await supabase
    .from("bookings")
    .insert([bookingData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

