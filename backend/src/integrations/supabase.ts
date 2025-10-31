import { createClient } from "@supabase/supabase-js";

// Prefer backend environment variable names. Fall back to VITE_* names
// only for convenience if someone mistakenly copied frontend env vars.
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable. Set SUPABASE_URL in your .env or deployment settings.");
}
if (!SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_KEY (or SUPABASE_ANON_KEY) environment variable. Set SUPABASE_KEY in your .env or deployment settings.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
