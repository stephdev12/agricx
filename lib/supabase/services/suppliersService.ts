import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Supplier } from '@/lib/supabase/types';
import { DEMO_SUPPLIERS } from '@/lib/data/demoData';

export async function fetchSuppliers(): Promise<Supplier[]> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return DEMO_SUPPLIERS;
  }

  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Note Supabase suppliers:', error.message);
      return DEMO_SUPPLIERS;
    }

    if (data && data.length > 0) {
      return data as Supplier[];
    }

    return DEMO_SUPPLIERS;
  } catch (err) {
    console.warn('Erreur réseau suppliers:', err);
    return DEMO_SUPPLIERS;
  }
}

export async function createSupplier(supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([supplier])
      .select()
      .single();

    if (error) {
      console.error('Erreur création fournisseur:', error);
      return null;
    }

    return data as Supplier;
  } catch (err) {
    console.error('Erreur inattendue création fournisseur:', err);
    return null;
  }
}
