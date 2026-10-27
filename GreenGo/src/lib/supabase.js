import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ldavatpsrnxfmgiatcty.supabase.co",
  "sb_publishable_cCKY3luawXtF3aydfPu0pg_ScRNy8o8",
  {
    auth: {
      // Require administrators to sign in again after a full browser/app restart.
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);