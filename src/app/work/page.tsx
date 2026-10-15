import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Work — ${siteConfig.name}`,
  description: `Selected software projects, web applications, and technical architectures built by ${siteConfig.name}.`,
};

export default function WorkIndexPage() {
  return (
    <main id="top" className="min-h-screen flex flex-col">
      <TopBar />

      <div className="flex-1 max-w-6xl mx-auto w-full pt-32 pb-20 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-14 sm:mb-20">
          <p
            className="text-xs sm:text-sm uppercase tracking-widest font-mono font-medium mb-3"
            style={{ color: 'var(--ink-subtle)' }}
          >
            Portfolio Index
          </p>
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase"
            style={{ color: 'var(--ink)' }}
          >
            All Work
          </h1>
          <p
            className="text-lg sm:text-xl mt-4 max-w-2xl"
            style={{ color: 'var(--ink-muted)' }}
          >
            A curated collection of web applications, full-stack systems, and developer tools built with intentional architecture.
          </p>
        </div>

        {/* Project Cards Stack */}
        <div className="flex flex-col gap-10">
          {siteConfig.projects.map((proj) => {
            return (
              <article
                key={proj.slug}
                className="desk-card p-8 sm:p-12 flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: 'var(--bw) solid var(--border)',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-hard-lg)',
                }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 font-mono text-xs font-bold">
                    <span
                      className="px-2.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'var(--accent-ink)',
                      }}
                    >
                      {proj.index}
                    </span>
                    <span style={{ color: 'var(--ink-subtle)' }}>
                      {proj.year} · {proj.type.toUpperCase()}
                    </span>
                    {proj.award && (
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold flex items-center gap-1"
                        style={{
                          backgroundColor: 'var(--canvas-base)',
                          border: '1px solid var(--border)',
                          color: 'var(--ink)',
                        }}
                      >
                        🏆 {proj.award}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
                    <Link
                      href={`/work/${proj.slug}`}
                      className="hover:underline decoration-2 decoration-[var(--accent)] underline-offset-4"
                    >
                      {proj.name}
                    </Link>
                  </h2>

                  <p className="text-xl font-medium mb-3" style={{ color: 'var(--ink-muted)' }}>
                    {proj.tagline}
                  </p>

                  <p className="text-base sm:text-lg max-w-2xl mb-8" style={{ color: 'var(--ink-subtle)' }}>
                    {proj.lede}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: 'var(--canvas-grid)' }}>
                  <div className="flex flex-wrap gap-2">
                    {proj.chips.map((chip) => (
                      <span key={chip} className="desk-chip text-sm">
                        {chip}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/work/${proj.slug}`}
                    className="desk-btn px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 group"
                  >
                    <span>Read write-up</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ContactSection />
      <Footer />
    </main>
  );
}
