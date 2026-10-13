import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { seo, siteUrl, siteIdentity } from "@/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// NOTE: these `variable` names deliberately do NOT match the semantic
// --font-display/--font-body/--font-technical tokens in globals.css.
// next/font injects its own CSS variable via a className on <html>;
// reusing the semantic token name here would make the two collide in
// the cascade (whichever the browser resolves last would silently
// win). globals.css instead composes these font-loader variables
// underneath the semantic tokens — see the primitive layer there.
const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const technicalFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Spec §33/§54 — global metadata. Each /work/[slug] page overrides
// this with project-specific metadata (see that route).
//
// `metadataBase` was previously unset, which means every relative URL
// Next emits (canonical, OG image) had no origin to resolve against and
// search/social crawlers got unusable or environment-dependent values.
// It now comes from `siteUrl`, the same constant robots.ts and
// sitemap.ts use, so there is exactly one origin to configure.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: "%s — Asish Oliver M",
  },
  description: seo.description,
  applicationName: siteIdentity.name,
  authors: [{ name: siteIdentity.name, url: siteIdentity.social.linkedin }],
  creator: siteIdentity.name,
  // Safe to declare here ONLY because every child route now sets its own
  // canonical via lib/metadata.ts's pageMetadata(). When this value was
  // previously inherited without being overridden, it stamped "/work",
  // "/about" and all six case studies as duplicates of the homepage.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteIdentity.name,
    title: seo.title,
    description: seo.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${technicalFont.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        {/* Keyboard users landing here must be able to bypass the sticky
            header straight to content. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:font-technical focus:text-xs focus:uppercase focus:tracking-[0.15em] focus:text-background"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
