import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasSupabaseConfig) {
  console.error(
    'Peringatan: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum terpasang dengan benar di file .env'
  )
}

// Inisialisasi Supabase Client dengan fallback string kosong agar tidak menyebabkan runtime crash awal
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)