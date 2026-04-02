import { createClient } from '@supabase/supabase-js';

let supabase = null;

const connectSupabase = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('ℹ️  Supabase skipped — running in development mode');
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set in production');
    process.exit(1);
  }

  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log('✅ Supabase connected');
};

const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not available in development mode');
  }
  return supabase;
};

export { connectSupabase, getSupabase };
