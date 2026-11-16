import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://tzkjogakzxozqhwybpxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6a2pvZ2FrenhvenFod3licHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4NDc1NTgsImV4cCI6MjExMDQyMzU1OH0.e3awbyhyqr1Cfbz4Bwnu2D1-r3vOQEE5nsdEFhaQuPU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
