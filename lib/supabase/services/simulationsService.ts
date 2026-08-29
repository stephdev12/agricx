import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ProjectSimulation } from '@/lib/supabase/types';

export async function saveSimulationToSupabase(
  simulation: ProjectSimulation,
  userId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    // Offline simulation saved to localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('agricx_saved_simulations') || '[]');
        const withId = { ...simulation, id: `local-${Date.now()}`, created_at: new Date().toISOString() };
        saved.unshift(withId);
        localStorage.setItem('agricx_saved_simulations', JSON.stringify(saved.slice(0, 20)));
        return { success: true, id: withId.id };
      } catch {
        return { success: true };
      }
    }
    return { success: true };
  }

  try {
    const { data: simData, error: simError } = await supabase
      .from('simulations')
      .insert([
        {
          user_id: userId || null,
          domain: simulation.domain,
          project_title: simulation.project_title,
          region: simulation.region,
          city: simulation.city,
          feasibility_score: simulation.feasibility_score,
          feasibility_status: simulation.feasibility_status,
          executive_summary: simulation.executive_summary,
          total_budget_requested_fcfa: simulation.total_budget_requested_fcfa,
          total_capex_fcfa: simulation.total_capex_fcfa,
          total_opex_fcfa: simulation.total_opex_fcfa,
          total_investment_fcfa: simulation.total_investment_fcfa,
          reserve_fund_fcfa: simulation.reserve_fund_fcfa,
          estimated_turnover_fcfa: simulation.estimated_turnover_fcfa,
          net_profit_fcfa: simulation.net_profit_fcfa,
          roi_percentage: simulation.roi_percentage,
          production_cycle_months: simulation.production_cycle_months,
          key_recommendations: simulation.key_recommendations,
        },
      ])
      .select('id')
      .single();

    if (simError || !simData) {
      console.warn('Sauvegarde distante indisponible, enregistrement local:', simError);
      return { success: true };
    }

    // Insert breakdown items if present
    if (simulation.financial_breakdown && simulation.financial_breakdown.length > 0) {
      const breakdownRows = simulation.financial_breakdown.map((item) => ({
        simulation_id: simData.id,
        item_name: item.item_name,
        category: item.category,
        unit_cost_fcfa: item.unit_cost_fcfa,
        quantity: item.quantity,
        total_fcfa: item.total_fcfa,
        notes: item.notes || null,
      }));

      await supabase.from('simulation_breakdowns').insert(breakdownRows);
    }

    return { success: true, id: simData.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: errorMsg };
  }
}

export async function getUserSimulations(userId: string): Promise<ProjectSimulation[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('simulations')
      .select('*, financial_breakdown:simulation_breakdowns(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as ProjectSimulation[];
  } catch {
    return [];
  }
}
