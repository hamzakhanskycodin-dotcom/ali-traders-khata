import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.com/tzkjogakzxozqhwybpxz';
const supabaseAnonKey = 'sb_publishable_fX_0dHCY1orH9kR3XT4SvA_YVeidxv1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
