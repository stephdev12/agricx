'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Calculator,
  Compass,
  Bot,
  Fish,
  Egg,
  Sprout,
  Bug,
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedMarqueeHero } from '@/components/ui/hero-3';
import { CardFlip } from '@/components/ui/card-flip';
import { CircularTestimonials, type Testimonial } from '@/components/ui/circular-testimonials';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=900&auto=format&fit=crop&q=80",
];

const STEPS = [
  {
    icon: Calculator,
    title: '1. Simulez votre budget',
    description: 'Calculez votre investissement initial, coûts d\'exploitation et rentabilité prévisionnelle.',
  },
  {
    icon: Compass,
    title: '2. Trouvez vos intrants',
    description: 'Localisez les fournisseurs d\'alevins, poussins, provende et semences de votre région.',
  },
  {
    icon: Bot,
    title: '3. Consultez l\'IA',
    description: 'Diagnostiquez les pathologies et suivez votre calendrier de production de A à Z.',
  },
];

const FILIERES_DATA = [
  {
    title: "Pisciculture Intensive",
    subtitle: "Silures Clarias & Tilapias",
    description: "Élevage en bacs hors-sol ou étangs avec calcul des rations et oxygénation.",
    features: ["Cycle de 4 à 5 mois", "Marché local porteur", "Alimentation locale", "Rentabilité > 35%"],
    icon: <Fish className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    title: "Héliciculture Géante",
    subtitle: "Archachatina marginata",
    description: "Production d'escargots géants pour la gastronomie et la cosmétique.",
    features: ["Faible coût initial", "Alimentation végétale", "Forte valeur marchande", "Cycle de 6 à 8 mois"],
    icon: <Bug className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    title: "Aviculture de Chair",
    subtitle: "Poulets Cobb500 / Ross308",
    description: "Bande de 500 à 5000 sujets avec thermorégulation et prophylaxie stricte.",
    features: ["Cycle rapide de 45 jours", "6 bandes par an", "Marché urbain direct", "Marge prévisible"],
    icon: <Egg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    title: "Maraîchage Intensif",
    subtitle: "Tomate, Piment & Poivron",
    description: "Culture sous abri ou plein champ avec goutte-à-goutte et lutte intégrée.",
    features: ["Récoltes échelonnées", "Irrigation maîtrisée", "Forte demande locale", "Semences hybrides"],
    icon: <Sprout className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Armand Mbarga",
    designation: "Pisciculteur à Obala",
    quote: "Le simulateur Agricx m'a permis de calibrer mes 6 bacs avec 450 000 FCFA. Le conseiller IA m'a prescrit le bon protocole en quelques secondes lors d'une montée de nitrites.",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
  },
  {
    name: "Céline Kenmogne",
    designation: "Éleveuse avicole à Bafoussam",
    quote: "L'annuaire m'a permis de trouver un accouveur certifié pour mes poussins à 15 minutes de ma ferme. Les fiches techniques sont claires et adaptées à notre climat.",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80",
  },
  {
    name: "Jean-Paul Etoundi",
    designation: "Agri-entrepreneur à Douala",
    quote: "Le devis CAPEX/OPEX en FCFA est précis et crédible pour convaincre les investisseurs. Agricx simplifie tout le démarrage d'une exploitation.",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
  },
];

export default function LandingPage() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sectionsRef.current) {
      const ctx = gsap.context(() => {
        const reveals = sectionsRef.current?.querySelectorAll('.gsap-reveal');
        reveals?.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });
      }, sectionsRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div ref={sectionsRef} className="flex flex-col min-h-screen bg-transparent text-foreground">
      {/* ─── Top Navbar ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/85 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Agricx
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Connexion
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="emerald" size="sm" className="shadow-xs">
                Démarrer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 1. Animated Marquee Hero (No badge tagline) ─── */}
      <AnimatedMarqueeHero
        tagline={null}
        title={
          <>
            Réussir son projet agricole
            <br />
            au Cameroun avec l&apos;IA
          </>
        }
        description="Simulateur financier en FCFA, fiches techniques vérifiées, annuaire de fournisseurs locaux et conseiller IA 24/7."
        ctaText="Lancer une simulation"
        ctaLink="/auth"
        secondaryCtaText="Explorer les filières"
        secondaryCtaLink="#filieres"
        images={HERO_IMAGES}
      />

      {/* ─── 2. Comment ça marche (Pure minimal) ─── */}
      <section className="py-20 px-4 sm:px-6 bg-card/40 backdrop-blur-xs border-y border-border gsap-reveal">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              De l&apos;idée à la première récolte
            </h2>
            <p className="text-sm text-muted-foreground">
              Une démarche structurée pour maximiser votre rentabilité dès la première campagne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <Card key={i} className="hover:border-border/80 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-muted text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <step.icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Filières phares ─── */}
      <section id="filieres" className="py-24 px-4 sm:px-6 gsap-reveal">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Modèles techniques & économiques
            </h2>
            <p className="text-sm text-muted-foreground">
              Découvrez les cycles de production et marges estimées des filières locales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
            {FILIERES_DATA.map((filiere) => (
              <CardFlip
                key={filiere.title}
                title={filiere.title}
                subtitle={filiere.subtitle}
                description={filiere.description}
                features={filiere.features}
                icon={filiere.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Témoignages ─── */}
      <section className="py-20 px-4 sm:px-6 bg-card/40 backdrop-blur-xs border-y border-border gsap-reveal">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Témoignages de producteurs
            </h2>
          </div>

          <CircularTestimonials
            testimonials={TESTIMONIALS}
            autoplay={true}
          />
        </div>
      </section>

      {/* ─── 5. CTA Final ─── */}
      <section className="py-20 px-4 sm:px-6 gsap-reveal">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Prêt à chiffrer votre exploitation ?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Rejoignez Agricx pour accéder immédiatement au simulateur de budget, aux guides techniques et à l&apos;assistance IA.
          </p>
          <div className="pt-2">
            <Link href="/auth">
              <Button variant="emerald" size="lg" className="gap-2 shadow-md">
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border py-6 px-4 sm:px-6 mt-auto bg-card/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
              <Leaf className="w-3 h-3" />
            </div>
            <span className="font-semibold text-foreground">Agricx</span>
          </div>
          <p>
            © {new Date().getFullYear()} Agricx · Cameroun.
          </p>
        </div>
      </footer>
    </div>
  );
}
