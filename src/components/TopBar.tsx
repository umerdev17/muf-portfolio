'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import CommandPalette from './CommandPalette';
import { siteConfig } from '@/config/site';

export default function TopBar() {
  const pathname = usePathname();
  const isWorkSubpage = pathname?.startsWith('/work') && pathname !== '/work';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close drawer on route change
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Work', href: '/#work' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-200"
        style={{
          backgroundColor: 'var(--canvas-base)',
          borderBottom: 'var(--bw) solid var(--border)',
          backgroundImage:
            'linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      >
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Monogram Mark or '← All work' */}
          <div className="flex items-center gap-3">
            {isWorkSubpage ? (
              <Link
                href="/work"
                className="desk-btn px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: 'var(--bw) solid var(--border)',
                  boxShadow: 'var(--shadow-hard)',
                }}
              >
                <span>←</span>
                <span>All work</span>
              </Link>
            ) : (
              <Link
                href="/#top"
                aria-label={`${siteConfig.name} - Home`}
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold tracking-tight text-base transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  border: 'var(--bw) solid var(--border)',
                  boxShadow: 'var(--shadow-hard)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {siteConfig.monogram}
              </Link>
            )}
          </div>

          {/* Desktop Center-Right Nav Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[var(--ink)] hover:underline decoration-[var(--accent)] decoration-2 underline-offset-4"
                style={{ color: 'var(--ink-subtle)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Command Palette + Theme Toggle + Resume Pill + Mobile Burger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <CommandPalette />
            <ThemeToggle />

            {/* Resume Button */}
            <a
              href={siteConfig.resume}
              download
              className="hidden sm:inline-flex desk-btn px-3.5 py-1.5 text-xs sm:text-sm rounded-full font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--surface)',
                border: 'var(--bw) solid var(--border)',
                boxShadow: 'var(--shadow-hard)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>Résumé</span>
              <span className="hidden lg:inline">&nbsp;PDF ↓</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={drawerOpen}
              className="md:hidden w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              style={{
                backgroundColor: 'var(--surface)',
                border: 'var(--bw) solid var(--border)',
                boxShadow: 'var(--shadow-hard)',
                color: 'var(--ink)',
              }}
            >
              <span
                className={`w-5 h-0.5 bg-[var(--ink)] transition-transform duration-200 ${
                  drawerOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-[var(--ink)] transition-opacity duration-200 ${
                  drawerOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-[var(--ink)] transition-transform duration-200 ${
                  drawerOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 md:hidden flex flex-col pt-20 px-6 pb-12 overflow-y-auto max-h-screen backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--canvas-base)',
            backgroundImage:
              'linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        >
          <nav className="flex flex-col gap-6 mt-6">
            {navLinks.map((link, idx) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="text-3xl font-bold py-2 transition-colors hover:text-[var(--accent)]"
                style={{
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-sans)',
                  borderBottom: '1px dashed var(--canvas-grid)',
                }}
              >
                <span className="font-mono text-sm opacity-50 mr-3">0{idx + 1}.</span>
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.resume}
              download
              onClick={() => setDrawerOpen(false)}
              className="desk-btn mt-4 py-3 rounded-xl text-center text-lg font-bold"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 'var(--bw) solid var(--border)',
                boxShadow: 'var(--shadow-hard)',
              }}
            >
              Download Résumé PDF ↓
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDrawerOpen(false)}
              className="desk-btn mt-2 py-3 rounded-xl text-center text-base font-bold flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--ink)',
                border: 'var(--bw) solid var(--border)',
                boxShadow: 'var(--shadow-hard)',
              }}
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 0-3.27 1.64 1.64 0 0 0 0 3.27m1.4 9.74v-8.37H5.06v8.37h2.8z" />
              </svg>
              <span>LinkedIn Profile ↗</span>
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
