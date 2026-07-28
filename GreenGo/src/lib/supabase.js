import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ldavatpsrnxfmgiatcty.supabase.co",
  "sb_publishable_cCKY3luawXtF3aydfPu0pg_ScRNy8o8",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);