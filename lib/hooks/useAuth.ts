'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '../supabase/client';
import { Profile } from '../supabase/types';

const STORAGE_KEY = 'agricx_user_profile';

const DEFAULT_PROFILE: Profile = {
  id: 'guest-user-237',
  full_name: 'Agri-Producteur',
  phone: '+237 670 00 00 00',
  whatsapp: '+237 670 00 00 00',
  region: 'Centre',
  city: 'Yaoundé',
  domains: ['Pisciculture', 'Héliciculture'],
  experience_level: 'Débutant',
  bio: 'Passionné par l\'agriculture moderne et l\'élevage intensif au Cameroun.',
  avatar_url: null,
  role: 'user',
};

export function useAuth() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Charger depuis le cache local immédiat
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch {
          // keep
        }
      }
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setIsLoaded(true);
      return;
    }

    // 2. Fonction de synchronisation avec Supabase Auth & Profile
    const syncUser = async (sessionUser: any) => {
      if (!sessionUser) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }

      setIsAuthenticated(true);
      const userMetaName = sessionUser.user_metadata?.full_name;
      const userEmail = sessionUser.email || '';
      const fallbackName = userMetaName || (userEmail ? userEmail.split('@')[0] : 'Agri-Producteur');

      // Check admin status (soit dans metadata, soit dans l'email, soit dans la table profile)
      const isUserAdmin =
        sessionUser.user_metadata?.role === 'admin' ||
        userEmail.toLowerCase().includes('admin') ||
        userEmail === 'stephdev12@gmail.com';

      setIsAdmin(isUserAdmin);

      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        if (dbProfile && dbProfile.full_name) {
          const merged: Profile = {
            ...dbProfile,
            role: dbProfile.role || (isUserAdmin ? 'admin' : 'user'),
          };
          setProfile(merged);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
          if (merged.role === 'admin') {
            setIsAdmin(true);
          }
        } else {
          // Profil temporaire avant synchronisation
          const tempProfile: Profile = {
            id: sessionUser.id,
            full_name: fallbackName,
            phone: sessionUser.user_metadata?.phone || '+237 670 00 00 00',
            whatsapp: sessionUser.user_metadata?.whatsapp || '+237 670 00 00 00',
            region: sessionUser.user_metadata?.region || 'Centre',
            city: sessionUser.user_metadata?.city || 'Yaoundé',
            domains: ['Pisciculture'],
            experience_level: 'Débutant',
            bio: 'Membre Agricx Cameroun',
            avatar_url: null,
            role: isUserAdmin ? 'admin' : 'user',
          };
          setProfile(tempProfile);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tempProfile));
          }
        }
      } catch (err) {
        console.warn('Erreur synchro profil:', err);
      }
    };

    // 3. Vérifier la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUser(session.user);
      }
      setIsLoaded(true);
    });

    // 4. Écouter les changements d'état en temps réel (connexion, déconnexion)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUser(session.user);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (newProfile: Partial<Profile>) => {
    const updated = { ...profile, ...newProfile, updated_at: new Date().toISOString() };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    const supabase = getSupabaseBrowserClient();
    if (supabase && isAuthenticated && profile.id !== 'guest-user-237') {
      await supabase.from('profiles').upsert(updated);
    }
  };

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsAuthenticated(false);
    setIsAdmin(false);
    setProfile(DEFAULT_PROFILE);
  };

  return {
    profile,
    isLoaded,
    isAuthenticated,
    isAdmin,
    updateProfile,
    signOut,
  };
}
