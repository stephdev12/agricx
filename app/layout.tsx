import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { GradientBackground } from '@/components/ui/almoayyed';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Agricx — Plateforme Intelligente Agro-Pastorale Cameroun',
  description:
    "Simulateur de projet en FCFA, annuaire géolocalisé de fournisseurs d'intrants, fiches techniques expertes et conseiller IA 24/7 pour l'agriculture et l'élevage au Cameroun.",
  keywords: [
    'Agriculture Cameroun',
    'Elevage Cameroun',
    'Agricx',
    'Simulateur FCFA',
    'Fournisseurs intrants',
    'MINADER MINEPIA',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen relative bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <GradientBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
