import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  marque: string;
  modele: string;
  prix_fcfa: number;
  type: string;
  tailles: string[];
  couleur: string;
  images: string[];
  disponible: boolean;
  created_at: string;
};
