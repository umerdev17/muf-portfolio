'use client';

import { siteConfig } from '@/config/site';

export default function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Head */}
        <div className="mb-12 sm:mb-16">
          <p
            className="text-xs sm:text-sm uppercase tracking-widest font-mono font-medium mb-2"
            style={{ color: 'var(--ink-subtle)' }}
          >
            Toolbox
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            What I build with
          </h2>
        </div>

        {/* 6 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {siteConfig.skills.map((group) => (
            <div
              key={group.category}
              className="flex flex-col gap-4 p-5 rounded-2xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                border: '1px dashed var(--canvas-grid)',
              }}
            >
              <h3
                className="font-mono text-xs sm:text-sm uppercase tracking-wider font-bold pb-2 border-b flex items-center justify-between"
                style={{
                  color: 'var(--ink-subtle)',
                  borderColor: 'var(--border)',
                }}
              >
                <span>{group.category}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              </h3>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {group.tools.map((tool) => (
                  <span
                    key={tool}
                    className="desk-chip text-sm cursor-default select-none"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
