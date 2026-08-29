'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Store,
  BrainCircuit,
  BookOpen,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  FileText,
  UserCheck,
  RefreshCw,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/useAuth';
import { SupplierRequest, Supplier, RagKnowledgeDocument, ContributorArticle } from '@/lib/supabase/types';
import {
  fetchPendingSupplierRequests,
  approveSupplierRequest,
  rejectSupplierRequest,
  createDirectSupplier,
  fetchSuppliers,
  deleteSupplier,
} from '@/lib/supabase/services/suppliersService';
import {
  fetchRagDocuments,
  ingestRagDocument,
  deleteRagDocument,
} from '@/lib/supabase/services/ragService';
import {
  fetchTechnicalArticles,
  createTechnicalArticle,
  deleteTechnicalArticle,
} from '@/lib/supabase/services/fichesService';
import { CAMEROON_REGIONS } from '@/lib/data/cameroon';

type AdminTab = 'requests' | 'suppliers' | 'rag' | 'fiches';

const CATEGORIES = [
  'Aliments & Provendes',
  'Alevins & Géniteurs',
  'Poussins & Accouvage',
  'Matériel & Bacs',
  'Géniteurs Escargots',
  'Engrais & Semences',
  'Produits Vétérinaires',
];

const DOMAINS = ['Pisciculture', 'Aviculture', 'Héliciculture', 'Maraîchage', 'Porciculture'];

export default function AdminPage() {
  const { profile, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('requests');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Data states
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ragDocs, setRagDocs] = useState<RagKnowledgeDocument[]>([]);
  const [articles, setArticles] = useState<ContributorArticle[]>([]);

  // Form states: New Supplier
  const [newSupBusiness, setNewSupBusiness] = useState('');
  const [newSupOwner, setNewSupOwner] = useState('');
  const [newSupCat, setNewSupCat] = useState(CATEGORIES[0]);
  const [newSupPhone, setNewSupPhone] = useState('+237 ');
  const [newSupWhatsapp, setNewSupWhatsapp] = useState('+237 ');
  const [newSupRegion, setNewSupRegion] = useState('Centre');
  const [newSupCity, setNewSupCity] = useState('Yaoundé');
  const [newSupAddress, setNewSupAddress] = useState('');

  // Form states: New RAG Document
  const [newRagTitle, setNewRagTitle] = useState('');
  const [newRagCat, setNewRagCat] = useState(DOMAINS[0]);
  const [newRagSource, setNewRagSource] = useState('Manuel Technique Agricx / MINEPIA');
  const [newRagContent, setNewRagContent] = useState('');

  // Form states: New Fiche Technique
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtCat, setNewArtCat] = useState(DOMAINS[0]);
  const [newArtSummary, setNewArtSummary] = useState('');
  const [newArtContent, setNewArtContent] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqData, supData, ragData, artData] = await Promise.all([
        fetchPendingSupplierRequests(),
        fetchSuppliers(),
        fetchRagDocuments(),
        fetchTechnicalArticles(),
      ]);
      setRequests(reqData);
      setSuppliers(supData);
      setRagDocs(ragData);
      setArticles(artData);
    } catch (err) {
      console.warn('Erreur chargement admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Actions Demandes ──
  const handleApproveRequest = async (req: SupplierRequest) => {
    setActionLoading(true);
    const res = await approveSupplierRequest(req);
    setActionLoading(false);
    if (res.success) {
      notify(`La boutique "${req.business_name}" a été validée et ajoutée à l'annuaire !`);
      loadData();
    } else {
      notify(`Erreur validation: ${res.error}`);
    }
  };

  const handleRejectRequest = async (id: string) => {
    setActionLoading(true);
    const res = await rejectSupplierRequest(id, 'Dossier incomplet ou non conforme');
    setActionLoading(false);
    if (res.success) {
      notify('Demande rejetée.');
      loadData();
    }
  };

  // ── Action Création Fournisseur Direct ──
  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await createDirectSupplier({
      business_name: newSupBusiness.trim(),
      owner_name: newSupOwner.trim(),
      category: newSupCat,
      phone: newSupPhone.trim(),
      whatsapp: newSupWhatsapp.trim(),
      region: newSupRegion,
      city: newSupCity.trim(),
      address: newSupAddress.trim(),
    });
    setActionLoading(false);
    if (res) {
      notify(`Fournisseur "${newSupBusiness}" créé avec succès !`);
      setNewSupBusiness('');
      setNewSupOwner('');
      setNewSupAddress('');
      loadData();
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm('Supprimer ce fournisseur de l\'annuaire ?')) return;
    await deleteSupplier(id);
    notify('Fournisseur supprimé.');
    loadData();
  };

  // ── Action Ingestion RAG ──
  const handleIngestRag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRagContent.trim()) {
      notify('Veuillez saisir le contenu du document technique.');
      return;
    }

    setActionLoading(true);
    // Découpage automatique en paragraphes/chunks
    const rawChunks = newRagContent
      .split(/\n\s*\n/)
      .map((t) => t.trim())
      .filter((t) => t.length > 20);

    const chunks = rawChunks.map((content, idx) => ({
      content,
      category: newRagCat,
      chunk_index: idx + 1,
    }));

    const res = await ingestRagDocument(newRagTitle.trim(), newRagCat, newRagSource.trim(), chunks);
    setActionLoading(false);

    if (res.success) {
      notify(`Document RAG "${newRagTitle}" ingéré avec ${chunks.length} fragments vectoriels !`);
      setNewRagTitle('');
      setNewRagContent('');
      loadData();
    } else {
      notify(`Erreur RAG: ${res.error}`);
    }
  };

  const handleDeleteRag = async (id: string) => {
    if (!confirm('Supprimer ce document de la base de connaissances RAG ?')) return;
    await deleteRagDocument(id);
    notify('Document RAG supprimé.');
    loadData();
  };

  // ── Action Création Fiche Technique ──
  const handleCreateFiche = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await createTechnicalArticle({
      author_id: profile.id !== 'guest-user-237' ? profile.id : null,
      author_name: profile.full_name || 'Administration Agricx',
      author_title: 'Expert Agronome Agricx',
      category: newArtCat,
      title: newArtTitle.trim(),
      summary: newArtSummary.trim(),
      content: newArtContent.trim(),
      tags: ['Guide Officiel', newArtCat, 'Cameroun'],
    });
    setActionLoading(false);
    if (res.success) {
      notify(`Fiche "${newArtTitle}" publiée avec succès !`);
      setNewArtTitle('');
      setNewArtSummary('');
      setNewArtContent('');
      loadData();
    }
  };

  const handleDeleteFiche = async (id: string) => {
    if (!confirm('Supprimer cet article technique ?')) return;
    await deleteTechnicalArticle(id);
    notify('Fiche technique supprimée.');
    loadData();
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28 sm:pb-32">
      {/* En-tête Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tableau de Bord Administrateur</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Gestion centrale des demandes commerçants, annuaire, fiches et base vectorielle RAG.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </motion.div>
      )}

      {/* Navigation Onglets */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === 'requests' ? 'emerald' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('requests')}
          className="relative text-xs"
        >
          <UserCheck className="w-4 h-4 mr-1.5" />
          Demandes Fournisseurs
          {pendingCount > 0 && (
            <span className="ml-2 px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </Button>

        <Button
          variant={activeTab === 'suppliers' ? 'emerald' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('suppliers')}
          className="text-xs"
        >
          <Store className="w-4 h-4 mr-1.5" />
          Annuaire Fournisseurs ({suppliers.length})
        </Button>

        <Button
          variant={activeTab === 'rag' ? 'emerald' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('rag')}
          className="text-xs"
        >
          <BrainCircuit className="w-4 h-4 mr-1.5" />
          Base RAG Vectorielle ({ragDocs.length})
        </Button>

        <Button
          variant={activeTab === 'fiches' ? 'emerald' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('fiches')}
          className="text-xs"
        >
          <BookOpen className="w-4 h-4 mr-1.5" />
          Fiches Techniques ({articles.length})
        </Button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ONGLET 1 : DEMANDES FOURNISSEURS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Demandes d&apos;inscription en attente d&apos;examen ({pendingCount})
            </h2>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border text-muted-foreground text-xs">
              Aucune demande d&apos;enregistrement de boutique en attente pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {requests.map((req) => (
                <Card key={req.id} className="border-border bg-card">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">{req.business_name}</h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              req.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : req.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {req.status === 'pending'
                              ? 'En attente'
                              : req.status === 'approved'
                              ? 'Validé'
                              : 'Rejeté'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Responsable : <strong className="text-foreground">{req.owner_name}</strong> · Catégorie : {req.category}
                        </p>
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="emerald"
                            size="sm"
                            onClick={() => handleApproveRequest(req)}
                            disabled={actionLoading}
                            className="text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Valider la boutique
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectRequest(req.id)}
                            disabled={actionLoading}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-border/60">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Tél : {req.phone} · WhatsApp : {req.whatsapp}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{req.city} ({req.region}) {req.address ? `· ${req.address}` : ''}</span>
                      </div>
                    </div>

                    {/* Pièces Justificatives */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Numéro CNI :</span>
                        <strong className="text-foreground font-mono">{req.cni_number}</strong>
                      </div>
                      {req.cni_photo_url && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Document CNI :</span>
                          <a
                            href={req.cni_photo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                          >
                            Voir pièce CNI <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {req.business_proof_url && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Preuve Entreprise / RCCM :</span>
                          <a
                            href={req.business_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                          >
                            Voir justificatif <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ONGLET 2 : ANNUAIRE & AJOUT DIRECT */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Ajouter directement un Fournisseur certifié
              </CardTitle>
              <CardDescription>
                Créez une boutique vérifiée qui apparaîtra immédiatement dans l&apos;annuaire public.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSupplier} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="sup-business">Nom de l&apos;établissement *</Label>
                    <Input
                      id="sup-business"
                      placeholder="Ex: AgriProvendes Ouest"
                      value={newSupBusiness}
                      onChange={(e) => setNewSupBusiness(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sup-owner">Responsable / Propriétaire</Label>
                    <Input
                      id="sup-owner"
                      placeholder="Ex: Ing. Talla"
                      value={newSupOwner}
                      onChange={(e) => setNewSupOwner(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sup-cat">Catégorie *</Label>
                    <select
                      id="sup-cat"
                      value={newSupCat}
                      onChange={(e) => setNewSupCat(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sup-phone">Téléphone *</Label>
                    <Input
                      id="sup-phone"
                      value={newSupPhone}
                      onChange={(e) => setNewSupPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sup-whatsapp">Numéro WhatsApp *</Label>
                    <Input
                      id="sup-whatsapp"
                      value={newSupWhatsapp}
                      onChange={(e) => setNewSupWhatsapp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sup-region">Région *</Label>
                    <select
                      id="sup-region"
                      value={newSupRegion}
                      onChange={(e) => setNewSupRegion(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {Object.keys(CAMEROON_REGIONS).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sup-city">Ville *</Label>
                    <Input
                      id="sup-city"
                      placeholder="Ex: Bafoussam"
                      value={newSupCity}
                      onChange={(e) => setNewSupCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="sup-address">Adresse / Repère</Label>
                    <Input
                      id="sup-address"
                      placeholder="Ex: Zone industrielle"
                      value={newSupAddress}
                      onChange={(e) => setNewSupAddress(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" variant="emerald" size="sm" disabled={actionLoading}>
                  {actionLoading ? 'Ajout en cours...' : 'Enregistrer le Fournisseur'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Liste des fournisseurs existants */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Fournisseurs actuellement actifs ({suppliers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suppliers.map((s) => (
                <Card key={s.id} className="border-border bg-card p-4 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{s.business_name}</h4>
                    <p className="text-xs text-muted-foreground">{s.category} · {s.city} ({s.region})</p>
                    <p className="text-xs text-muted-foreground mt-1">Tél: {s.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSupplier(s.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ONGLET 3 : BASE DE CONNAISSANCES RAG */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'rag' && (
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-600" />
                Ingérer un document de connaissances RAG (pgvector)
              </CardTitle>
              <CardDescription>
                Injectez un protocole zootechnique, guide MINADER/MINEPIA ou manuel d&apos;élevage. Le texte sera automatiquement découpé en fragments de connaissances pour le conseiller IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIngestRag} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="rag-title">Titre du document *</Label>
                    <Input
                      id="rag-title"
                      placeholder="Ex: Protocole Traitement Pathologies Silures"
                      value={newRagTitle}
                      onChange={(e) => setNewRagTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rag-cat">Filière / Domaine *</Label>
                    <select
                      id="rag-cat"
                      value={newRagCat}
                      onChange={(e) => setNewRagCat(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {DOMAINS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-3">
                    <Label htmlFor="rag-source">Source / Auteur</Label>
                    <Input
                      id="rag-source"
                      placeholder="Ex: MINEPIA Cameroun, Dr. Mbarga"
                      value={newRagSource}
                      onChange={(e) => setNewRagSource(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-3">
                    <Label htmlFor="rag-content">Contenu textuel du protocole (séparez les sections par un saut de ligne) *</Label>
                    <Textarea
                      id="rag-content"
                      rows={6}
                      placeholder="Collez ici les fiches techniques, dosages, symptômes et recommandations thérapeutiques..."
                      value={newRagContent}
                      onChange={(e) => setNewRagContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="emerald" size="sm" disabled={actionLoading}>
                  {actionLoading ? 'Ingestion et vectorisation...' : 'Ingérer dans la base RAG'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Liste des documents RAG actifs */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Documents RAG actifs dans la base ({ragDocs.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ragDocs.map((doc) => (
                <Card key={doc.id} className="border-border bg-card p-4 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{doc.title}</h4>
                    <p className="text-xs text-muted-foreground">{doc.category} · {doc.source || 'Source interne'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRag(doc.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ONGLET 4 : FICHES TECHNIQUES */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'fiches' && (
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Publier une nouvelle Fiche Technique
              </CardTitle>
              <CardDescription>
                Créez un guide agronomique public accessible par tous les producteurs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFiche} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="art-title">Titre du guide *</Label>
                    <Input
                      id="art-title"
                      placeholder="Ex: Conduite d'un élevage de poulets de chair en 45 jours"
                      value={newArtTitle}
                      onChange={(e) => setNewArtTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="art-cat">Filière *</Label>
                    <select
                      id="art-cat"
                      value={newArtCat}
                      onChange={(e) => setNewArtCat(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {DOMAINS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-3">
                    <Label htmlFor="art-summary">Résumé court *</Label>
                    <Input
                      id="art-summary"
                      placeholder="Résumé en 1 phrase des points clés..."
                      value={newArtSummary}
                      onChange={(e) => setNewArtSummary(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-3">
                    <Label htmlFor="art-content">Contenu complet du guide *</Label>
                    <Textarea
                      id="art-content"
                      rows={6}
                      placeholder="Déroulez les étapes, les recommandations techniques et le protocole d'alimentation..."
                      value={newArtContent}
                      onChange={(e) => setNewArtContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="emerald" size="sm" disabled={actionLoading}>
                  {actionLoading ? 'Publication...' : 'Publier la fiche technique'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Liste des fiches */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Fiches techniques publiées ({articles.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {articles.map((art) => (
                <Card key={art.id} className="border-border bg-card p-4 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{art.title}</h4>
                    <p className="text-xs text-muted-foreground">{art.category} · Par {art.author_name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{art.summary}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFiche(art.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
