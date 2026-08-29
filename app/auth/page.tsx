'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      // Offline Demo Mode
      setTimeout(() => {
        setLoading(false);
        router.push('/app');
      }, 400);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push('/app');
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    router.push('/app');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-transparent text-foreground relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm space-y-6"
      >
        {/* Brand Link */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Agricx</span>
          </Link>
        </div>

        {/* Card using user's exact structure */}
        <Card className="w-full max-w-sm border-border bg-card/90 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-foreground">{isSignUp ? 'Créer un compte' : 'Connexion à votre compte'}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp
                ? 'Renseignez vos coordonnées pour démarrer'
                : 'Entrez votre email pour accéder à votre espace'}
            </CardDescription>
            <CardAction>
              <Button
                variant="link"
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 p-0 h-auto cursor-pointer font-medium"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Connexion' : 'S\'inscrire'}
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs border border-red-500/20">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} id="auth-form">
              <div className="flex flex-col gap-4">
                {isSignUp && (
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Paul Atangana"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="agri@exemple.cm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                    {!isSignUp && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Un lien de réinitialisation vous sera envoyé par email.");
                        }}
                        className="ml-auto inline-block text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
                      >
                        Mot de passe oublié ?
                      </a>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2.5">
            <Button
              type="submit"
              form="auth-form"
              variant="emerald"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Chargement...'
                : isSignUp
                ? 'Créer mon compte'
                : 'Se connecter'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full text-xs"
              onClick={handleGuest}
            >
              Continuer en mode invité / démo
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-muted-foreground" />
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground">
          En continuant, vous acceptez les conditions d&apos;utilisation d&apos;Agricx.
        </p>
      </motion.div>
    </div>
  );
}
