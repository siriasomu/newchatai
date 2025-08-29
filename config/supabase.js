const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL || 'your_supabase_project_url';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your_supabase_anon_key';

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
