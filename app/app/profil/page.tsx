'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { User, MapPin, Phone, Save, LogOut, ShieldAlert, Store, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { CAMEROON_REGIONS } from '@/lib/data/cameroon';

export default function ProfilPage() {
  const router = useRouter();
  const { profile, updateProfile, signOut, isAdmin, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || '');
  const [region, setRegion] = useState(profile.region || 'Centre');
  const [city, setCity] = useState(profile.city || 'Yaoundé');
  const [bio, setBio] = useState(profile.bio || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile.full_name) {
      setFullName(profile.full_name);
      setPhone(profile.phone || '');
      setWhatsapp(profile.whatsapp || '');
      setRegion(profile.region || 'Centre');
      setCity(profile.city || 'Yaoundé');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile({ full_name: fullName, phone, whatsapp, region, city, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profil</h1>
        <p className="text-sm text-muted-foreground">Gérez vos informations personnelles et vos accès</p>
      </motion.div>

      {/* Raccourcis Fournisseur & Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/app/fournisseur-formulaire"
          className="p-4 rounded-2xl border border-border bg-card/80 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Devenir Fournisseur</p>
              <p className="text-[11px] text-muted-foreground">Enregistrer ma boutique avec CNI</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
        </Link>

        {isAdmin && (
          <Link
            href="/app/admin"
            className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Dashboard Admin</p>
                <p className="text-[11px] text-muted-foreground">Valider demandes, RAG & fiches</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </Link>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 pb-5 border-b border-border">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{fullName || 'Agri-Producteur'}</p>
                <p className="text-xs text-muted-foreground">{region} · {city}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    Téléphone
                  </Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    Région
                  </Label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.keys(CAMEROON_REGIONS).map((r) => (
                      <option key={r} value={r} className="bg-card text-foreground">{r}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio / Expérience</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="emerald" onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                {saved ? 'Enregistré ✓' : 'Enregistrer'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-xs text-muted-foreground hover:text-red-500 hover:border-red-500/30 gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
