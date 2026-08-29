'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { CAMEROON_REGIONS } from '@/lib/data/cameroon';
import { generateWhatsAppLink } from '@/lib/utils/formatters';
import { fetchSuppliers } from '@/lib/supabase/services/suppliersService';
import { Supplier } from '@/lib/supabase/types';

const ALL_REGIONS = Object.keys(CAMEROON_REGIONS);

export default function AnnuairePage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const regionAnchor = useComboboxAnchor();
  const categoryAnchor = useComboboxAnchor();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchSuppliers();
      setSuppliers(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const allCategories = Array.from(new Set(suppliers.map((s) => s.category)));

  const filtered = suppliers.filter((s) => {
    const matchSearch =
      !searchTerm ||
      s.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegion =
      selectedRegions.length === 0 || selectedRegions.includes(s.region);
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(s.category);
    return matchSearch && matchRegion && matchCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Fournisseurs
        </h1>
        <p className="text-sm text-muted-foreground">
          Intrants, géniteurs et matériel agricole au Cameroun
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un fournisseur, une ville (Yaoundé, Douala, Bafoussam)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Régions Combobox */}
          <Combobox
            multiple
            items={ALL_REGIONS}
            value={selectedRegions}
            onValueChange={setSelectedRegions}
          >
            <ComboboxChips ref={regionAnchor}>
              <ComboboxValue>
                {(values) => (
                  <>
                    {values.map((val) => (
                      <ComboboxChip key={val}>{val}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput placeholder="Filtrer par région..." />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={regionAnchor}>
              <ComboboxEmpty>Aucune région trouvée.</ComboboxEmpty>
              <ComboboxList>
                {() =>
                  ALL_REGIONS.map((r) => (
                    <ComboboxItem key={r} value={r}>
                      {r}
                    </ComboboxItem>
                  ))
                }
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {/* Catégories Combobox */}
          <Combobox
            multiple
            items={allCategories}
            value={selectedCategories}
            onValueChange={setSelectedCategories}
          >
            <ComboboxChips ref={categoryAnchor}>
              <ComboboxValue>
                {(values) => (
                  <>
                    {values.map((val) => (
                      <ComboboxChip key={val}>{val}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput placeholder="Filtrer par catégorie..." />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={categoryAnchor}>
              <ComboboxEmpty>Aucune catégorie trouvée.</ComboboxEmpty>
              <ComboboxList>
                {() =>
                  allCategories.map((c) => (
                    <ComboboxItem key={c} value={c}>
                      {c}
                    </ComboboxItem>
                  ))
                }
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </motion.div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filtered.length} fournisseur{filtered.length > 1 ? 's' : ''}</span>
        {(selectedRegions.length > 0 || selectedCategories.length > 0 || searchTerm) && (
          <button
            onClick={() => {
              setSelectedRegions([]);
              setSelectedCategories([]);
              setSearchTerm('');
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Simplified Minimal Supplier Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            Chargement des fournisseurs...
          </div>
        ) : (
          filtered.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
            >
              <Card className="hover:border-border/80 transition-colors">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {supplier.business_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{supplier.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                        {supplier.city} ({supplier.region})
                      </span>
                    </div>
                  </div>

                  {supplier.whatsapp && (
                    <div className="shrink-0 pt-1 sm:pt-0">
                      <a
                        href={generateWhatsAppLink(
                          supplier.whatsapp,
                          `Bonjour ${supplier.business_name}, je vous contacte via Agricx pour une commande.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="emerald"
                          size="sm"
                          className="text-xs gap-1.5 h-8 w-full sm:w-auto cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contacter</span>
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground bg-card rounded-2xl border border-border">
            Aucun fournisseur ne correspond à votre recherche.
          </div>
        )}
      </div>
    </div>
  );
}
