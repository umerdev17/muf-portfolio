'use client';

import { siteConfig } from '@/config/site';

export default function ExtrasSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Head */}
        <div className="mb-12 sm:mb-16">
          <p
            className="text-xs sm:text-sm uppercase tracking-widest font-mono font-medium mb-2"
            style={{ color: 'var(--ink-subtle)' }}
          >
            The rest of it
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            Education, awards, writing
          </h2>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Education */}
          <div
            className="desk-card p-6 sm:p-8 flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-hard)',
            }}
          >
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold mb-4 flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--canvas-grid)' }}>
                <span>Education</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              </h3>

              {siteConfig.education.map((edu, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                    {edu.degree}
                  </h4>
                  <p className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
                    {edu.school}
                  </p>
                  <p className="font-mono text-xs mt-1" style={{ color: 'var(--ink-subtle)' }}>
                    {edu.meta}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t text-xs font-mono" style={{ borderColor: 'var(--canvas-grid)', color: 'var(--ink-subtle)' }}>
              Core: Computer Science, Programming &amp; Logic
            </div>
          </div>

          {/* Column 2: Awards */}
          <div
            className="desk-card p-6 sm:p-8 flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-hard)',
            }}
          >
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold mb-4 flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--canvas-grid)' }}>
                <span>Awards</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              </h3>

              <div className="py-2">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                  Nothing on the shelf yet. The projects in <a href="#work" className="font-bold underline decoration-[var(--accent)] underline-offset-2">Work</a> are the actual proof — check those.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-xs font-mono" style={{ borderColor: 'var(--canvas-grid)', color: 'var(--ink-subtle)' }}>
              Honest status · results over trophies
            </div>
          </div>

          {/* Column 3: Writing / Notes */}
          <div
            className="desk-card p-6 sm:p-8 flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-hard)',
            }}
          >
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold mb-4 flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--canvas-grid)' }}>
                <span>Writing</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              </h3>

              <div className="py-2">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                  Technical deep-dives and engineering logs on AI-assisted development, React architecture, and MERN optimization in draft.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-xs font-mono" style={{ borderColor: 'var(--canvas-grid)', color: 'var(--ink-subtle)' }}>
              Publications dropping soon
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
