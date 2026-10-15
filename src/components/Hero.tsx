'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow: Location + Rule */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-4 sm:mb-6"
        >
          <span
            className="text-xs sm:text-sm uppercase tracking-widest font-mono font-medium"
            style={{ color: 'var(--ink-subtle)' }}
          >
            {siteConfig.location}
          </span>
          <div
            className="h-px flex-1 max-w-xs"
            style={{ backgroundColor: 'var(--ink-subtle)', opacity: 0.35 }}
          />
        </motion.div>

        {/* MEGA NAME: Dynamic Lines */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8 select-none"
        >
          <h1
            className="font-bold tracking-tight uppercase leading-[0.9] flex flex-col"
            style={{
              fontSize:
                siteConfig.nameLines.length > 2
                  ? 'clamp(2.15rem, 9.5vw, 7.8rem)'
                  : 'var(--fs-mega)',
              color: 'var(--ink)',
              letterSpacing: '-0.025em',
            }}
          >
            {siteConfig.nameLines.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* ONE-LINER / HEADLINE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug font-normal mb-8 sm:mb-10 max-w-3xl"
          style={{
            color: 'var(--ink)',
            maxWidth: 'var(--measure)',
          }}
          dangerouslySetInnerHTML={{ __html: siteConfig.heroLine }}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-4 sm:gap-6"
        >
          {/* Main Pill: See the work (Launches Playable Discovery Game) */}
          <Link
            href="/canvas"
            className="group desk-btn px-6 py-3 rounded-full text-base font-semibold flex items-center gap-3 transition-all"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard)',
              color: 'var(--ink)',
            }}
          >
            <span>See the work</span>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
              }}
            >
              →
            </span>
          </Link>

          {/* Ghost pill: Direct link to static work section */}
          <a
            href="#work"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              border: '1px dashed var(--ink-subtle)',
              color: 'var(--ink)',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <span>Prefer static cards?</span>
            <span
              className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
              }}
            >
              browse list ↓
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
