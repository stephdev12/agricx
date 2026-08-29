'use client';

import Link from 'next/link';
import { type Variants, motion } from 'motion/react';
import {
  Calculator,
  Compass,
  BookOpen,
  Users,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const QUICK_ACTIONS = [
  {
    href: '/app/simulateur',
    icon: Calculator,
    title: 'Simulateur de projet',
    description: 'Budget prévisionnel CAPEX/OPEX en FCFA',
  },
  {
    href: '/app/annuaire',
    icon: Compass,
    title: 'Annuaire fournisseurs',
    description: 'Fournisseurs d\'intrants géolocalisés',
  },
  {
    href: '/app/fiches',
    icon: BookOpen,
    title: 'Fiches techniques',
    description: 'Guides experts par filière',
  },
  {
    href: '/app/communaute',
    icon: Users,
    title: 'Communauté',
    description: 'Échangez avec d\'autres agriculteurs',
  },
  {
    href: '/app/chat-ia',
    icon: Bot,
    title: 'Conseiller IA',
    description: 'Diagnostic photo & conseils 24/7',
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function AppDashboard() {
  const { profile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Bonjour{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Que souhaitez-vous faire aujourd&apos;hui ?
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
      >
        {QUICK_ACTIONS.map((action) => (
          <motion.div key={action.href} variants={item}>
            <Link
              href={action.href}
              className="group flex items-start gap-4 p-5 rounded-2xl border border-border bg-card/80 backdrop-blur-md hover:border-emerald-500/50 hover:shadow-md transition-all duration-200"
            >
              <div className="p-2.5 rounded-xl bg-muted text-muted-foreground group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <action.icon className="w-5 h-5 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{action.title}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
