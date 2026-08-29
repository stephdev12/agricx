'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, User, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { fetchTechnicalArticles } from '@/lib/supabase/services/fichesService';
import { ContributorArticle } from '@/lib/supabase/types';

export default function FichesPage() {
  const [articles, setArticles] = useState<ContributorArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const categoryAnchor = useComboboxAnchor();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchTechnicalArticles();
      setArticles(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const allCategories = Array.from(new Set(articles.map((a) => a.category)));

  const filtered = articles.filter((a) => {
    const matchSearch =
      !searchTerm ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(a.category);
    return matchSearch && matchCategory;
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
          Fiches Techniques & Guides
        </h1>
        <p className="text-sm text-muted-foreground">
          Protocoles de prophylaxie, formulation alimentaire et fiches de culture adaptées au Cameroun
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-12 gap-3"
      >
        <div className="sm:col-span-7 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher (ex: provende silure, mildiou tomate, poussins)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <div className="sm:col-span-5">
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
                    <ComboboxChipsInput placeholder="Filtrer par filière..." />
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

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filtered.length} fiche{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</span>
        {(selectedCategories.length > 0 || searchTerm) && (
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSearchTerm('');
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            Chargement des fiches...
          </div>
        ) : (
          filtered.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
            >
              <Card
                className="hover:border-border/80 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === article.id ? null : article.id)
                }
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {article.category}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          {article.date_published}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        expandedId === article.id ? 'rotate-90 text-foreground' : ''
                      }`}
                    />
                  </div>

                  {/* Expanded Content */}
                  {expandedId === article.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                      className="pt-4 border-t border-border space-y-4 text-xs leading-relaxed text-foreground"
                    >
                      <div className="whitespace-pre-line bg-muted/40 p-4 rounded-xl border border-border">
                        {article.content}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5" />
                          <span>Par {article.author_name}</span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                              navigator.share({
                                title: article.title,
                                text: article.summary,
                              });
                            }
                          }}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          Partager
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground bg-card rounded-2xl border border-border">
            Aucune fiche ne correspond à vos filtres.
          </div>
        )}
      </div>
    </div>
  );
}
