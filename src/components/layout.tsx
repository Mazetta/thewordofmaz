import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    // Ajout de flex + flex-col pour permettre au footer de se placer en bas
    <div className="min-h-screen bg-background">
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

      {/* Ajout de flex-1 pour pousser le footer vers le bas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Retrait du fixed bottom-0 w-full
          Ajout de mt-auto pour coller au bas de page */}
      <footer className="bg-muted border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Mazeriio. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

