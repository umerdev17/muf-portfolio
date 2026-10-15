'use client';

import { siteConfig } from '@/config/site';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="py-12 px-4 sm:px-6 border-t"
      style={{
        borderColor: 'var(--canvas-grid)',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: '2px 2px 0 0 var(--border)',
              color: 'var(--ink)',
            }}
          >
            ↑
          </button>
          <span style={{ color: 'var(--ink)' }}>
            {siteConfig.name} · {siteConfig.location}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ink-subtle)' }}>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="flex items-center gap-1.5 hover:text-[var(--ink)] underline underline-offset-4 decoration-[var(--accent)] decoration-2 transition-colors font-bold"
            style={{ color: 'var(--ink)' }}
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 0-3.27 1.64 1.64 0 0 0 0 3.27m1.4 9.74v-8.37H5.06v8.37h2.8z" />
            </svg>
            <span>LinkedIn ↗</span>
          </a>
          <span>·</span>
          <span>Thanks for scrolling all the way down :)</span>
        </div>
      </div>
    </footer>
  );
}
