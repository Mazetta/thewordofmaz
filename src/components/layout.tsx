import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SocialLinks } from "@/components/social-links";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    // Ajout du flex + flex-col pour le layout vertical
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex items-center text-xl font-bold text-foreground"
              >
                🍄 The Word of Maz
              </Link>
            </div>
            <div className="flex items-center">
              <ModeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* ⬇️ Nouveau wrapper pour que flex-1 prenne toute la hauteur disponible */}
      <div className="flex-1">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
      </div>

      {/* Footer collé en bas grâce à mt-auto */}
      <footer className="bg-zinc-900 dark:bg-zinc-950 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <SocialLinks />
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mazeriio. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
