'use client';

import { siteConfig } from '@/config/site';

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <p
            className="text-xs sm:text-sm uppercase tracking-widest font-mono font-medium mb-2"
            style={{ color: 'var(--ink-subtle)' }}
          >
            About
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight inline-block highlight-yellow"
            style={{ color: 'var(--ink)' }}
          >
            Hi there!
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Interactive Card / Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="desk-card w-full max-w-sm p-6 sm:p-8 flex flex-col justify-between min-h-[360px]"
              style={{
                backgroundColor: 'var(--surface)',
                border: 'var(--bw) solid var(--border)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-hard-lg)',
              }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--canvas-grid)' }}>
                <span className="font-mono text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--ink-subtle)' }}>
                  ID CARD // 2025
                </span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              </div>

              <div className="my-6">
                <div className="relative inline-block mb-4">
                  <div
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative"
                    style={{
                      border: 'var(--bw) solid var(--border)',
                      boxShadow: 'var(--shadow-hard)',
                      backgroundColor: 'var(--canvas-base)',
                    }}
                  >
                    <img
                      src="/images/umer-portrait.jpg"
                      alt={siteConfig.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {/* Floating Monogram Badge */}
                  <div
                    className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--accent-ink)',
                      border: 'var(--bw) solid var(--border)',
                      boxShadow: '2px 2px 0 0 var(--border)',
                    }}
                  >
                    {siteConfig.monogram}
                  </div>
                </div>

                <h3 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
                  {siteConfig.name}
                </h3>
                <p className="font-mono text-sm mt-1" style={{ color: 'var(--ink-subtle)' }}>
                  {siteConfig.role}
                </p>
                <p className="text-xs font-mono mt-1 opacity-75">
                  📍 {siteConfig.location}
                </p>
              </div>

              <div
                className="p-3 rounded-lg text-xs font-mono"
                style={{
                  backgroundColor: 'var(--canvas-base)',
                  border: '1px solid var(--border)',
                  color: 'var(--ink-muted)',
                }}
              >
                status: open for junior full-stack roles &amp; freelance builds.
              </div>
            </div>
          </div>

          {/* Right: 4 Punchy Paragraphs */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--ink)' }}>
            <p>
              I&apos;m <strong className="font-semibold">{siteConfig.name}</strong> — an AI-assisted full-stack developer based in Pakistan focused on building modern web applications, responsive interfaces, and practical software solutions.
            </p>
            <p>
              I am currently in my first year studying Computer Science (ICS) at <strong className="font-semibold">Government Boys Degree College Kohsar</strong>, alongside software development internship work at <strong className="font-semibold">Digital Elliptical</strong> (2026–Present) collaborating on full-stack application building, and previous call-center experience as a Call Center Agent at <strong className="font-semibold">Riuman International</strong> (approx. 3 months in 2025).
            </p>
            <p>
              I build software using AI-assisted development workflows with tools like <strong className="font-semibold">Cursor</strong> and <strong className="font-semibold">Antigravity</strong>, combined with foundational modern web technologies including React, Next.js, TypeScript, Node.js, and Tailwind CSS.
            </p>
            <p>
              Right now I&apos;m looking for junior full-stack developer roles or freelance projects where I can build dependable software with a team. The fastest way to get in touch is through the <a href="#contact" className="underline decoration-2 decoration-[var(--accent)] underline-offset-4 font-semibold hover:text-[var(--accent)]">Contact section</a> below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
