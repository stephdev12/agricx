'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Calculator,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Coins,
  MapPin,
  MessageCircle,
  Bot,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectSimulation } from '@/lib/supabase/types';
import { computeProjectSimulation } from '@/lib/data/simulatorEngine';
import { DEMO_SUPPLIERS } from '@/lib/data/demoData';
import { generateWhatsAppLink } from '@/lib/utils/formatters';

import { saveSimulationToSupabase } from '@/lib/supabase/services/simulationsService';
import { Bookmark } from 'lucide-react';

export default function RoadmapPage() {
  const router = useRouter();
  const [simulation, setSimulation] = useState<ProjectSimulation | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('current_simulation');
      if (stored) {
        try {
          setSimulation(JSON.parse(stored));
          return;
        } catch {
          // fallback
        }
      }
      const fallback = computeProjectSimulation({
        domain: 'Pisciculture',
        region: 'Centre',
        city: 'Yaoundé (Mendong)',
        budgetFcfa: 500000,
        spaceSqm: 30,
        nearbySuppliers: DEMO_SUPPLIERS,
      });
      setSimulation(fallback);
    }
  }, []);

  if (!simulation) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">Chargement de votre feuille de route...</p>
      </div>
    );
  }

  const toggleChecklist = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSave = async () => {
    if (!simulation) return;
    setSaving(true);
    const res = await saveSimulationToSupabase(simulation);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 print:hidden">
        <Link
          href="/app/simulateur"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modifier les paramètres</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{saved ? 'Enregistré ✓' : saving ? 'Enregistrement...' : 'Sauvegarder'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer / PDF</span>
          </Button>
          <Link href="/app/chat-ia">
            <Button variant="emerald" size="sm" className="gap-1.5 text-xs">
              <Bot className="w-3.5 h-3.5" />
              <span>Consulter l&apos;IA</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <Card className="bg-neutral-900 dark:bg-neutral-950 text-white border-neutral-800 shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
            <span>Feuille de Route Technique</span>
            <span className="font-mono-amount flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {simulation.city} ({simulation.region})
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {simulation.project_title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            {simulation.executive_summary}
          </p>
        </CardContent>
      </Card>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono-amount">
        <Card>
          <CardContent className="p-3.5">
            <span className="text-[10px] text-muted-foreground uppercase font-sans block">Investissement</span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {new Intl.NumberFormat('fr-FR').format(simulation.total_investment_fcfa)} F
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[10px] text-muted-foreground uppercase font-sans block">CAPEX</span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {new Intl.NumberFormat('fr-FR').format(simulation.total_capex_fcfa)} F
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[10px] text-muted-foreground uppercase font-sans block">OPEX</span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {new Intl.NumberFormat('fr-FR').format(simulation.total_opex_fcfa)} F
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[10px] text-muted-foreground uppercase font-sans block">Chiffre d&apos;Affaires</span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {new Intl.NumberFormat('fr-FR').format(simulation.estimated_turnover_fcfa)} F
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[10px] text-muted-foreground uppercase font-sans block">Bénéfice Net</span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {new Intl.NumberFormat('fr-FR').format(simulation.net_profit_fcfa)} F
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[10px] text-muted-foreground uppercase font-sans block">ROI</span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {simulation.roi_percentage}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* 2 Columns: Financial Table (Left) & Timeline Steps (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Budgétaire (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Détail Budgétaire</span>
          </h2>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/60 border-b border-border text-muted-foreground font-medium text-[11px]">
                    <th className="py-2.5 px-4">Poste</th>
                    <th className="py-2.5 px-2 text-center">Type</th>
                    <th className="py-2.5 px-4 text-right">Total FCFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {simulation.financial_breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="font-medium text-foreground">{item.item_name}</div>
                        {item.notes && (
                          <div className="text-[11px] text-muted-foreground font-normal mt-0.5">{item.notes}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center text-[11px] font-medium text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono-amount font-bold text-foreground">
                        {new Intl.NumberFormat('fr-FR').format(item.total_fcfa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Timeline & Checklist (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Calendrier Opérationnel</span>
          </h2>

          <div className="space-y-3">
            {simulation.timeline.map((step, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{step.title}</span>
                    <span className="text-[11px] text-muted-foreground font-mono-amount">{step.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

                  <div className="space-y-1.5 pt-1.5 border-t border-border">
                    {step.checklist.map((item, cIdx) => {
                      const key = `${idx}-${cIdx}`;
                      const isChecked = !!checkedItems[key];
                      return (
                        <label
                          key={cIdx}
                          onClick={() => toggleChecklist(key)}
                          className="flex items-start gap-2 text-xs text-foreground/90 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-border text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className={isChecked ? 'line-through text-muted-foreground' : ''}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Suppliers */}
      {simulation.nearby_suppliers && simulation.nearby_suppliers.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-base font-semibold text-foreground">
            Fournisseurs recommandés à proximité
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {simulation.nearby_suppliers.slice(0, 3).map((sup) => (
              <Card key={sup.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground truncate">{sup.business_name}</p>
                      <p className="text-[11px] text-muted-foreground">{sup.category}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    {sup.city}
                  </p>
                  {sup.whatsapp && (
                    <a
                      href={generateWhatsAppLink(
                        sup.whatsapp,
                        `Bonjour ${sup.business_name}, j'ai simulé mon projet sur Agricx et souhaite commander des intrants.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block pt-1"
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8">
                        <MessageCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Commander via WhatsApp</span>
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
