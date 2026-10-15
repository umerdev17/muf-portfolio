'use client';

import Link from 'next/link';
import { siteConfig, Project } from '@/config/site';

export default function WorkSection() {
  return (
    <section id="work" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Head */}
        <div className="mb-12 sm:mb-16">
          <p
            className="text-xs sm:text-sm uppercase tracking-widest font-mono font-medium mb-2"
            style={{ color: 'var(--ink-subtle)' }}
          >
            Selected work
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--ink)' }}
          >
            Featured projects
          </h2>
          <p
            className="text-base sm:text-lg"
            style={{ color: 'var(--ink-subtle)', maxWidth: 'var(--measure)' }}
          >
            Each of these has a full write-up — purpose, genuine features, stack, and architecture.
          </p>
        </div>

        {/* Project Cards Stack */}
        <div className="flex flex-col gap-8">
          {siteConfig.projects.map((proj: Project) => {
            return (
              <article
                key={proj.slug}
                className="desk-card p-6 sm:p-10 flex flex-col justify-between transition-all"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: 'var(--bw) solid var(--border)',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-hard)',
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

                  <h3 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
                    <Link
                      href={`/work/${proj.slug}`}
                      className="hover:underline decoration-2 decoration-[var(--accent)] underline-offset-4"
                    >
                      {proj.name}
                    </Link>
                  </h3>

                  <p className="text-lg sm:text-xl font-medium mb-3" style={{ color: 'var(--ink-muted)' }}>
                    {proj.tagline}
                  </p>

                  <p className="text-base sm:text-lg max-w-2xl mb-6" style={{ color: 'var(--ink-subtle)' }}>
                    {proj.lede}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: 'var(--canvas-grid)' }}>
                  <div className="flex flex-wrap gap-2">
                    {proj.chips.map((chip) => (
                      <span key={chip} className="desk-chip text-xs sm:text-sm">
                        {chip}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/work/${proj.slug}`}
                    className="desk-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 group"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: 'var(--bw) solid var(--border)',
                      boxShadow: 'var(--shadow-hard)',
                      color: 'var(--ink)',
                    }}
                  >
                    <span>Read the write-up</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
