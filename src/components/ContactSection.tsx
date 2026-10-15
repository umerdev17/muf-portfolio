'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Giant H2 */}
        <div className="mb-8">
          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.95]"
            style={{ color: 'var(--ink)' }}
          >
            <span className="block">Let&apos;s build</span>
            <span className="block">something.</span>
          </h2>
        </div>

        {/* Subtitle / Availability */}
        <p
          className="text-lg sm:text-2xl font-medium mb-8 max-w-2xl leading-relaxed"
          style={{ color: 'var(--ink-muted)' }}
        >
          {siteConfig.availability}{' '}
          <span style={{ color: 'var(--ink)' }}>
            The fastest way to reach me is email — I answer all of them.
          </span>
        </p>

        {/* Big Email Link */}
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${siteConfig.email}?subject=Collaboration%20Inquiry`}
            className="font-mono text-xl sm:text-3xl md:text-4xl font-bold tracking-tight inline-block underline decoration-4 decoration-[var(--accent)] underline-offset-8 transition-transform hover:-translate-y-0.5 break-all"
            style={{ color: 'var(--ink)' }}
          >
            {siteConfig.email}
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label="Copy email address"
            className="desk-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Links Pills */}
        <div className="flex flex-wrap items-center gap-4 mb-20">
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="desk-btn px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 group"
          >
            <svg
              className="w-4 h-4 fill-current shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 0-3.27 1.64 1.64 0 0 0 0 3.27m1.4 9.74v-8.37H5.06v8.37h2.8z" />
            </svg>
            <span>LinkedIn</span>
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }}
            >
              ↗
            </span>
          </a>

          <a
            href={siteConfig.resume}
            download
            className="desk-btn px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 group"
          >
            <span>Résumé</span>
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }}
            >
              ↓
            </span>
          </a>
        </div>

        {/* Fun Desk Teaser Box (#desk) */}
        <div
          id="desk"
          className="p-6 sm:p-10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
          style={{
            border: '2px dashed var(--ink-subtle)',
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          <div className="max-w-2xl">
            <h3 className="font-bold text-xl sm:text-2xl mb-2" style={{ color: 'var(--ink)' }}>
              Oh, and this page is the boring half.
            </h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              The main portfolio is finished. This one is a little less serious. There&apos;s a canvas, beautiful cards, a few games, lofi, and probably more than there needs to be.
            </p>
            <p className="text-xs sm:text-sm font-mono mt-2" style={{ color: 'var(--ink-subtle)' }}>
              Some of it keeps score. Try not to take that personally.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
            <Link
              href="/canvas"
              className="desk-btn px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 group"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 'var(--bw) solid var(--border)',
                boxShadow: 'var(--shadow-hard)',
              }}
            >
              <span>Open the canvas</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <span className="text-[11px] font-mono" style={{ color: 'var(--ink-subtle)' }}>
              Interactive draggable desktop workspace
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
