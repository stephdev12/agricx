'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Calculator,
  MapPin,
  Coins,
  Maximize2,
  Droplet,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CAMEROON_REGIONS, CAMEROON_CITIES, AGRO_DOMAINS } from '@/lib/data/cameroon';
import { computeProjectSimulation } from '@/lib/data/simulatorEngine';
import { DEMO_SUPPLIERS } from '@/lib/data/demoData';

function SimulatorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [domain, setDomain] = useState('Pisciculture');
  const [region, setRegion] = useState('Centre');
  const [city, setCity] = useState('Yaoundé (Mendong)');
  const [budgetFcfa, setBudgetFcfa] = useState(500000);
  const [spaceSqm, setSpaceSqm] = useState(30);
  const [waterSource, setWaterSource] = useState('Puits / Forage');
  const [experienceLevel, setExperienceLevel] = useState<'Débutant' | 'Intermédiaire' | 'Expert'>('Débutant');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const urlDomain = searchParams.get('domain');
    const urlRegion = searchParams.get('region');
    const urlBudget = searchParams.get('budget');
    if (urlDomain) setDomain(urlDomain);
    if (urlRegion) setRegion(urlRegion);
    if (urlBudget && !isNaN(Number(urlBudget))) setBudgetFcfa(Number(urlBudget));
  }, [searchParams]);

  const availableCities = CAMEROON_CITIES.filter((c) => c.region === region);
  const budgetPresets = [250000, 500000, 1000000, 2500000, 5000000];

  const previewSimulation = computeProjectSimulation({
    domain, region, city, budgetFcfa, spaceSqm, waterSource, experienceLevel,
    nearbySuppliers: DEMO_SUPPLIERS,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    const simulation = computeProjectSimulation({
      domain, region, city, budgetFcfa, spaceSqm, waterSource, experienceLevel,
      nearbySuppliers: DEMO_SUPPLIERS,
    });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_simulation', JSON.stringify(simulation));
    }
    setTimeout(() => {
      router.push('/app/simulateur/roadmap');
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Simulateur de projet</h1>
        <p className="text-sm text-muted-foreground">Calculez la rentabilité de votre projet en FCFA</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <Card>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Filière */}
                <div className="space-y-2">
                  <Label>Filière d&apos;activité</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AGRO_DOMAINS.map((d) => (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => setDomain(d.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          domain === d.id
                            ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                            : 'bg-card hover:bg-muted text-foreground border-border'
                        }`}
                      >
                        <div className="font-medium truncate">{d.shortName}</div>
                        <div className={`text-[10px] mt-0.5 ${domain === d.id ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                          {d.estimatedRoi} ROI
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Région & Ville */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      Région
                    </Label>
                    <select
                      value={region}
                      onChange={(e) => {
                        const newRegion = e.target.value;
                        setRegion(newRegion);
                        const firstCity = CAMEROON_CITIES.find((c) => c.region === newRegion);
                        if (firstCity) setCity(firstCity.name);
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Object.keys(CAMEROON_REGIONS).map((reg) => (
                        <option key={reg} value={reg} className="bg-card text-foreground">{reg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      Ville
                    </Label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {availableCities.map((c) => (
                        <option key={c.name} value={c.name} className="bg-card text-foreground">{c.name}</option>
                      ))}
                      <option value={CAMEROON_REGIONS[region]} className="bg-card text-foreground">{CAMEROON_REGIONS[region]} (Centre-ville)</option>
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-muted-foreground" />
                      Budget initial
                    </Label>
                    <span className="font-mono-amount text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {new Intl.NumberFormat('fr-FR').format(budgetFcfa)} FCFA
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200000} max={10000000} step={50000}
                    value={budgetFcfa}
                    onChange={(e) => setBudgetFcfa(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {budgetPresets.map((preset) => (
                      <button
                        type="button" key={preset}
                        onClick={() => setBudgetFcfa(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono-amount font-medium transition-colors cursor-pointer border ${
                          budgetFcfa === preset
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-muted/70 text-foreground/80 border-border hover:bg-muted'
                        }`}
                      >
                        {new Intl.NumberFormat('fr-FR').format(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Space & Water */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                      Superficie ({spaceSqm} m²)
                    </Label>
                    <input
                      type="number" min={10} max={5000}
                      value={spaceSqm}
                      onChange={(e) => setSpaceSqm(Math.max(5, Number(e.target.value)))}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm text-foreground font-mono-amount focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-muted-foreground" />
                      Source d&apos;eau
                    </Label>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Puits / Forage" className="bg-card text-foreground">Puits / Forage</option>
                      <option value="Eau de ville (Camwater)" className="bg-card text-foreground">Camwater</option>
                      <option value="Cours d'eau / Rivière" className="bg-card text-foreground">Rivière</option>
                    </select>
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                    Expérience
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Débutant', 'Intermédiaire', 'Expert'] as const).map((lvl) => (
                      <button
                        type="button" key={lvl}
                        onClick={() => setExperienceLevel(lvl)}
                        className={`py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                          experienceLevel === lvl
                            ? 'bg-foreground text-background border-foreground font-semibold'
                            : 'bg-muted/70 text-foreground/80 border-border hover:bg-muted'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="emerald"
                  size="lg"
                  className="w-full"
                  disabled={isCalculating}
                >
                  {isCalculating ? 'Génération...' : 'Générer la feuille de route'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Synthèse prévisionnelle</h3>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {previewSimulation.feasibility_score}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono-amount">
                <div className="p-3 rounded-xl bg-muted/60 border border-border">
                  <span className="text-[10px] uppercase font-sans text-muted-foreground block">CAPEX</span>
                  <span className="text-sm font-semibold text-foreground">
                    {new Intl.NumberFormat('fr-FR').format(previewSimulation.total_capex_fcfa)} F
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border">
                  <span className="text-[10px] uppercase font-sans text-muted-foreground block">OPEX</span>
                  <span className="text-sm font-semibold text-foreground">
                    {new Intl.NumberFormat('fr-FR').format(previewSimulation.total_opex_fcfa)} F
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border">
                  <span className="text-[10px] uppercase font-sans text-muted-foreground block">CA estimé</span>
                  <span className="text-sm font-semibold text-foreground">
                    {new Intl.NumberFormat('fr-FR').format(previewSimulation.estimated_turnover_fcfa)} F
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border">
                  <span className="text-[10px] uppercase font-sans text-muted-foreground block">ROI</span>
                  <span className="text-sm font-semibold text-foreground">
                    {previewSimulation.roi_percentage}%
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed">
                Calcul basé sur les coûts réels du marché camerounais 2026, incluant un fonds de réserve de 10%.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-muted-foreground">Chargement...</div>}>
      <SimulatorForm />
    </Suspense>
  );
}
