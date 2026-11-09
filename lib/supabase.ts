import { createClient } from "@supabase/supabase-js";

// Identity comes from Google OAuth (NextAuth), not Supabase Auth, so the app talks to
// Supabase with the service-role key and filters every query by user_id itself.
export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
