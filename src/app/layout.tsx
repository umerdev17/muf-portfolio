import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import LenisProvider from '@/components/LenisProvider';
import CustomCursor from '@/components/CustomCursor';
import { siteConfig } from '@/config/site';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description:
    'AI-assisted full-stack developer building modern web applications and responsive interfaces.',
  metadataBase: new URL('https://umerfarooq.dev'),
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description:
      'AI-assisted full-stack developer building modern web applications and responsive interfaces.',
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description:
      'AI-assisted full-stack developer building modern web applications and responsive interfaces.',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23facc00'/><rect x='2' y='2' width='28' height='28' rx='4' fill='none' stroke='%23161616' stroke-width='2'/><text x='16' y='20' font-family='monospace' font-weight='bold' font-size='11' fill='%23161616' text-anchor='middle'>MUF</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Pakistan',
    },
    url: 'https://umerfarooq.dev',
    sameAs: [siteConfig.linkedin],
  };

  return (
    <html lang="en" className={spaceGrotesk.variable} data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("desk.theme");if(t==="dark"){document.documentElement.setAttribute("data-theme","dark");}else{document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
