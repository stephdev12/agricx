'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calculator,
  Compass,
  BookOpen,
  Users,
  Bot,
  User,
  Leaf,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { MenuBar, type MenuItem } from '@/components/ui/glow-menu';

const GLOW_NAV_ITEMS: MenuItem[] = [
  {
    icon: Leaf,
    label: 'Accueil',
    href: '/app',
    gradient:
      'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(5,150,105,0.08) 50%, rgba(4,120,87,0) 100%)',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Calculator,
    label: 'Simulateur',
    href: '/app/simulateur',
    gradient:
      'radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(8,145,178,0.08) 50%, rgba(14,116,144,0) 100%)',
    iconColor: 'text-cyan-500',
  },
  {
    icon: Compass,
    label: 'Annuaire',
    href: '/app/annuaire',
    gradient:
      'radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(234,88,12,0.08) 50%, rgba(194,65,12,0) 100%)',
    iconColor: 'text-orange-500',
  },
  {
    icon: BookOpen,
    label: 'Fiches',
    href: '/app/fiches',
    gradient:
      'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(37,99,235,0.08) 50%, rgba(29,78,216,0) 100%)',
    iconColor: 'text-blue-500',
  },
  {
    icon: Users,
    label: 'Communauté',
    href: '/app/communaute',
    gradient:
      'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(147,51,234,0.08) 50%, rgba(126,34,206,0) 100%)',
    iconColor: 'text-purple-500',
  },
  {
    icon: Bot,
    label: 'Conseiller IA',
    href: '/app/chat-ia',
    gradient:
      'radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(219,39,119,0.08) 50%, rgba(190,24,93,0) 100%)',
    iconColor: 'text-pink-500',
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Find active item label based on pathname
  const getActiveLabel = () => {
    if (pathname === '/app') return 'Accueil';
    if (pathname.startsWith('/app/simulateur')) return 'Simulateur';
    if (pathname.startsWith('/app/annuaire')) return 'Annuaire';
    if (pathname.startsWith('/app/fiches')) return 'Fiches';
    if (pathname.startsWith('/app/communaute')) return 'Communauté';
    if (pathname.startsWith('/app/chat-ia')) return 'Conseiller IA';
    return '';
  };

  const handleItemClick = (label: string) => {
    const target = GLOW_NAV_ITEMS.find((item) => item.label === label);
    if (target) {
      router.push(target.href);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-transparent text-foreground">
      {/* ─── Top Brand & Actions Bar ─── */}
      <header className="sticky top-0 z-40 bg-card/75 backdrop-blur-xl border-b border-border/50 h-16 flex items-center px-4 sm:px-8 justify-between transition-colors">
        <Link href="/app" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Leaf className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground leading-tight">
              Agricx
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              Plateforme Agro-Pastorale
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/app/profil"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 bg-card/60 hover:bg-muted transition-colors text-xs font-medium text-foreground"
            title="Mon Profil"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="hidden sm:inline">Mon Profil</span>
          </Link>
        </div>
      </header>

      {/* ─── Main Content Canvas (Full Width) ─── */}
      <main className={`flex-1 w-full ${pathname === '/app/chat-ia' ? 'flex flex-col h-[calc(100dvh-4rem)] overflow-hidden' : 'pb-28 sm:pb-32 pt-2 sm:pt-4'}`}>
        {children}
      </main>

      {/* ─── Fixed Bottom Glow Menu Bar ─── */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-max pointer-events-auto">
        <MenuBar
          items={GLOW_NAV_ITEMS}
          activeItem={getActiveLabel()}
          onItemClick={handleItemClick}
          className="shadow-2xl border-border/70"
        />
      </div>
    </div>
  );
}
