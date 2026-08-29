'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '../supabase/client';
import { Profile } from '../supabase/types';

const STORAGE_KEY = 'agroguide_user_profile';

const DEFAULT_PROFILE: Profile = {
  id: 'guest-user-237',
  full_name: 'Entrepreneur Agro 237',
  phone: '+237 670 00 00 00',
  whatsapp: '+237 670 00 00 00',
  region: 'Centre',
  city: 'Yaoundé',
  domains: ['Pisciculture', 'Héliciculture'],
  experience_level: 'Débutant',
  bio: 'Passionné par l\'agriculture moderne et l\'élevage intensif au Cameroun.',
  avatar_url: null,
};

export function useAuth() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Charger profil local
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch {
          // keep default
        }
      }
    }

    // Vérifier session Supabase si client disponible
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setProfile(data as Profile);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              }
            });
        }
      });
    }

    setIsLoaded(true);
  }, []);

  const updateProfile = async (newProfile: Partial<Profile>) => {
    const updated = { ...profile, ...newProfile, updated_at: new Date().toISOString() };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    const supabase = getSupabaseBrowserClient();
    if (supabase && isAuthenticated) {
      await supabase.from('profiles').upsert(updated);
    }
  };

  return {
    profile,
    isLoaded,
    isAuthenticated,
    updateProfile,
  };
}
