import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Supplier, SupplierRequest } from '@/lib/supabase/types';
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

    if (data !== null) {
      // Si la table existe et renvoie des données (même vide si le producteur n'a pas encore ajouté)
      return data.length > 0 ? (data as Supplier[]) : DEMO_SUPPLIERS;
    }

    return DEMO_SUPPLIERS;
  } catch (err) {
    console.warn('Erreur réseau suppliers:', err);
    return DEMO_SUPPLIERS;
  }
}

export async function createDirectSupplier(supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([
        {
          ...supplier,
          verified: true,
          rating: supplier.rating || 4.9,
          review_count: supplier.review_count || 1,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erreur création fournisseur direct:', error);
      return null;
    }

    return data as Supplier;
  } catch (err) {
    console.error('Erreur inattendue création fournisseur:', err);
    return null;
  }
}

export async function deleteSupplier(supplierId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('suppliers').delete().eq('id', supplierId);
    return !error;
  } catch {
    return false;
  }
}

// ─── GESTION DES DEMANDES D'ENREGISTREMENT FOURNISSEUR (CNI + JUSTIFICATIFS) ───

export async function submitSupplierRequest(
  request: Omit<SupplierRequest, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: SupplierRequest; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { success: false, error: 'Connexion à la base de données non disponible.' };
  }

  try {
    const { data, error } = await supabase
      .from('supplier_requests')
      .insert([
        {
          ...request,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as SupplierRequest };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur inattendue lors de la soumission.' };
  }
}

export async function fetchPendingSupplierRequests(): Promise<SupplierRequest[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('supplier_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as SupplierRequest[];
  } catch {
    return [];
  }
}

export async function approveSupplierRequest(
  request: SupplierRequest
): Promise<{ success: boolean; supplier?: Supplier; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { success: false, error: 'Base non connectée' };

  try {
    // 1. Mettre à jour le statut de la demande
    const { error: updateError } = await supabase
      .from('supplier_requests')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', request.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // 2. Insérer dans la table active des fournisseurs
    const { data: newSupplier, error: insertError } = await supabase
      .from('suppliers')
      .insert([
        {
          user_id: request.user_id,
          business_name: request.business_name,
          owner_name: request.owner_name,
          category: request.category,
          phone: request.phone,
          whatsapp: request.whatsapp,
          region: request.region,
          city: request.city,
          address: request.address,
          verified: true,
          rating: 5.0,
          review_count: 1,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true, supplier: newSupplier as Supplier };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de la validation' };
  }
}

export async function rejectSupplierRequest(
  requestId: string,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { success: false, error: 'Base non connectée' };

  try {
    const { error } = await supabase
      .from('supplier_requests')
      .update({
        status: 'rejected',
        admin_notes: adminNotes || 'Dossier incomplet ou non vérifiable',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
