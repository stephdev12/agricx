'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Store, CheckCircle2, ShieldCheck, FileText, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/useAuth';
import { submitSupplierRequest } from '@/lib/supabase/services/suppliersService';
import { CAMEROON_REGIONS } from '@/lib/data/cameroon';

const CATEGORIES = [
  'Aliments & Provendes',
  'Alevins & Géniteurs',
  'Poussins & Accouvage',
  'Matériel & Bacs',
  'Géniteurs Escargots',
  'Engrais & Semences',
  'Produits Vétérinaires',
];

export default function FournisseurFormulairePage() {
  const router = useRouter();
  const { profile, isAuthenticated } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState(profile.full_name || '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [phone, setPhone] = useState(profile.phone || '+237 ');
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || '+237 ');
  const [region, setRegion] = useState(profile.region || 'Centre');
  const [city, setCity] = useState(profile.city || 'Yaoundé');
  const [address, setAddress] = useState('');
  const [cniNumber, setCniNumber] = useState('');
  const [cniPhotoUrl, setCniPhotoUrl] = useState('');
  const [businessProofUrl, setBusinessProofUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!cniNumber.trim()) {
      setErrorMsg('Le numéro de CNI est obligatoire pour vérifier l\'authenticité de votre boutique.');
      setLoading(false);
      return;
    }

    const res = await submitSupplierRequest({
      user_id: isAuthenticated && profile.id !== 'guest-user-237' ? profile.id : null,
      business_name: businessName.trim(),
      owner_name: ownerName.trim(),
      category,
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      region,
      city: city.trim(),
      address: address.trim(),
      cni_number: cniNumber.trim(),
      cni_photo_url: cniPhotoUrl.trim() || null,
      business_proof_url: businessProofUrl.trim() || null,
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(res.error || 'Une erreur est survenue lors de la soumission de votre dossier.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 sm:pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/annuaire">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à l&apos;annuaire
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Store className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Enregistrer ma boutique sur Agricx
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rejoignez le réseau officiel des fournisseurs d&apos;intrants vérifiés au Cameroun.
        </p>
      </div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-card border border-emerald-500/30 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Dossier soumis avec succès !</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Votre demande d&apos;enregistrement pour <strong className="text-foreground">{businessName}</strong> a été transmise à l&apos;administration Agricx. Notre équipe vérifie vos pièces (CNI et justificatif) sous 24h avant activation publique dans l&apos;annuaire.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="emerald" onClick={() => router.push('/app/annuaire')}>
              Consulter l&apos;annuaire
            </Button>
            <Button variant="outline" onClick={() => router.push('/app')}>
              Retour à l&apos;accueil
            </Button>
          </div>
        </motion.div>
      ) : (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Formulaire de référencement Fournisseur</CardTitle>
            <CardDescription>
              Tous les champs marqués sont requis pour garantir la confiance des éleveurs et agriculteurs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMsg && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs border border-red-500/20">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Établissement */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  1. Informations sur votre activité
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="businessName">Nom de l&apos;entreprise / Établissement *</Label>
                    <Input
                      id="businessName"
                      placeholder="Ex: Provenderie du Centre & Alevinage"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="ownerName">Nom du responsable / Propriétaire *</Label>
                    <Input
                      id="ownerName"
                      placeholder="Ex: Dr. Jean-Paul Mbarga"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="category">Catégorie principale *</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Localisation */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  2. Coordonnées & Localisation au Cameroun
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Téléphone d&apos;appel *</Label>
                    <Input
                      id="phone"
                      placeholder="+237 677 00 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp">Numéro WhatsApp Commercial *</Label>
                    <Input
                      id="whatsapp"
                      placeholder="+237 699 00 00 00"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="region">Région *</Label>
                    <select
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {Object.keys(CAMEROON_REGIONS).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      placeholder="Ex: Obala, Bafoussam, Douala"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="address">Adresse / Repère précis</Label>
                    <Input
                      id="address"
                      placeholder="Ex: Face marché central, route de Yaoundé"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Pièces d'identité & Preuve d'activité */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    3. Vérification d&apos;identité & Preuve d&apos;entreprise
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cniNumber">Numéro de CNI du responsable *</Label>
                    <Input
                      id="cniNumber"
                      placeholder="Ex: 1184920392"
                      value={cniNumber}
                      onChange={(e) => setCniNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cniPhotoUrl">Lien ou référence photo CNI (Recto/Verso)</Label>
                    <Input
                      id="cniPhotoUrl"
                      placeholder="https://... ou référence document"
                      value={cniPhotoUrl}
                      onChange={(e) => setCniPhotoUrl(e.target.value)}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Document confidentiel, accessible uniquement par l&apos;administrateur pour validation.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="businessProofUrl">Preuve d&apos;activité (RCCM, Déclaration, Bail commercial, Photo boutique)</Label>
                    <Input
                      id="businessProofUrl"
                      placeholder="https://... ou description du justificatif"
                      value={businessProofUrl}
                      onChange={(e) => setBusinessProofUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button type="submit" variant="emerald" className="w-full" disabled={loading}>
                  {loading ? 'Transmission du dossier...' : 'Soumettre ma demande d\'enregistrement'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
