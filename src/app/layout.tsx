import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mazeriio.net/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Word of Maz",
    template: `%s | The Word of Maz`,
  },
  description: "Tout savoir sur moi, mes projets et ma vie.",
  openGraph: {
    title: "The Word of Maz",
    description: "Tout savoir sur moi, mes projets et ma vie.",
    url: siteUrl,
    siteName: "mazeriio.net",
    images: [
      {
        url: `${siteUrl}/mushroom-128.png`,
        width: 128,
        height: 128,
        alt: "The Word of Maz",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "The Word of Maz",
    description: "Tout savoir sur moi, mes projets et ma vie.",
    images: [`${siteUrl}/mushroom-128.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteUrl}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
    { color: "#f83700" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
