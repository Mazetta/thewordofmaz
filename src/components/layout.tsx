import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SocialLinks } from "@/components/social-links";
import SearchBar from "@/components/search-bar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    // Ajout du flex + flex-col pour le layout vertical
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Mobile: Affichage empilé */}
            <div className="flex md:hidden items-center justify-between h-16 gap-2">
              <Link
                href="/"
                className="flex items-center text-lg font-bold text-foreground whitespace-nowrap"
              >
                🍄
              </Link>
              <div className="flex-1 mx-2">
                <SearchBar />
              </div>
              <ModeToggle />
            </div>
            
            {/* Desktop: 3 colonnes */}
            <div className="hidden md:flex items-center h-16 gap-4">
              <div className="flex-1 flex">
                <Link
                  href="/"
                  className="flex items-center text-xl font-bold text-foreground whitespace-nowrap"
                >
                  🍄 The Word of Maz
                </Link>
              </div>
              <div className="flex-1 flex justify-center px-4">
                <div className="w-full max-w-md">
                  <SearchBar />
                </div>
              </div>
              <div className="flex-1 flex justify-end">
                <ModeToggle />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ⬇️ Nouveau wrapper pour que flex-1 prenne toute la hauteur disponible */}
      <div className="flex-1 main-bg">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
      </div>

      {/* Footer collé en bas grâce à mt-auto */}
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-24">
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
