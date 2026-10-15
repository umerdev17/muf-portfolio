'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site';

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Head */}
        <div className="mb-12 sm:mb-16">
          <p
            className="text-xs sm:text-sm uppercase tracking-widest font-mono font-medium mb-2"
            style={{ color: 'var(--ink-subtle)' }}
          >
            Experience
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            Where I&apos;ve been
          </h2>
        </div>

        {/* Experience Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Quick Index List */}
          <aside className="lg:col-span-4 hidden lg:block">
            <ol className="flex flex-col gap-3 font-mono text-sm" aria-label="Roles list">
              {siteConfig.experience.map((item, idx) => {
                const isActive = expandedIndex === idx;
                return (
                  <li key={item.company}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(idx)}
                      className="w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer"
                      style={{
                        backgroundColor: isActive ? 'var(--surface)' : 'transparent',
                        borderColor: isActive ? 'var(--border)' : 'var(--canvas-grid)',
                        boxShadow: isActive ? 'var(--shadow-hard)' : 'none',
                        color: 'var(--ink)',
                      }}
                    >
                      {item.logo ? (
                        <div
                          className="w-7 h-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1"
                          style={{
                            backgroundColor: 'var(--canvas-base)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <img src={item.logo} alt="" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: isActive ? 'var(--accent)' : 'var(--ink-subtle)',
                          }}
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold">{item.company}</span>
                        <span className="text-xs opacity-70">
                          {item.role} · {item.dates}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* Right Accordion Cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {siteConfig.experience.map((item, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <article
                  key={item.company}
                  className="desk-card p-6 sm:p-8"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: 'var(--bw) solid var(--border)',
                    borderRadius: 'var(--radius-card)',
                    boxShadow: isOpen ? 'var(--shadow-hard-lg)' : 'var(--shadow-hard)',
                  }}
                >
                  {/* Header / Toggle button */}
                  <div className="w-full flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                      {/* Company Logo container */}
                      {item.logo ? (
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center p-2.5 shrink-0"
                          style={{
                            backgroundColor: 'var(--canvas-base)',
                            border: 'var(--bw) solid var(--border)',
                            boxShadow: '2px 2px 0 0 var(--border)',
                          }}
                        >
                          <img
                            src={item.logo}
                            alt={`${item.company} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-lg shrink-0"
                          style={{
                            backgroundColor: 'var(--canvas-base)',
                            border: 'var(--bw) solid var(--border)',
                            boxShadow: '2px 2px 0 0 var(--border)',
                            color: 'var(--ink)',
                          }}
                        >
                          {item.company.charAt(0)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className="font-mono text-xs uppercase tracking-wider font-semibold"
                            style={{ color: 'var(--ink-subtle)' }}
                          >
                            {item.dates} · {item.location}
                          </span>
                          {item.website && (
                            <a
                              href={item.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded transition-all hover:-translate-y-0.5"
                              style={{
                                backgroundColor: 'var(--canvas-base)',
                                border: '1px solid var(--border)',
                                color: 'var(--ink)',
                              }}
                            >
                              <span>Website</span>
                              <span>↗</span>
                            </a>
                          )}
                          {item.linkedin && (
                            <a
                              href={item.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded transition-all hover:-translate-y-0.5"
                              style={{
                                backgroundColor: 'var(--canvas-base)',
                                border: '1px solid var(--border)',
                                color: 'var(--ink)',
                              }}
                            >
                              <span>LinkedIn</span>
                              <span>↗</span>
                            </a>
                          )}
                        </div>

                        <h3
                          className="text-xl sm:text-2xl font-bold tracking-tight"
                          style={{ color: 'var(--ink)' }}
                        >
                          {item.role}{' '}
                          <span style={{ color: 'var(--ink-subtle)', fontWeight: 400 }}>
                            — {item.company}
                          </span>
                        </h3>
                        <p
                          className="text-sm sm:text-base mt-2"
                          style={{ color: 'var(--ink-muted)' }}
                        >
                          {item.oneLiner}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(idx)}
                      aria-expanded={isOpen}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border flex-shrink-0 self-start sm:self-auto cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                      style={{
                        backgroundColor: 'var(--canvas-base)',
                        borderColor: 'var(--border)',
                        color: 'var(--ink)',
                        boxShadow: '2px 2px 0 0 var(--border)',
                      }}
                    >
                      <span>{isOpen ? 'Hide' : 'Details'}</span>
                      <span
                        className={`transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        ↓
                      </span>
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isOpen && (
                    <div className="mt-6 pt-6 border-t flex flex-col gap-5" style={{ borderColor: 'var(--canvas-grid)' }}>
                      <ul className="flex flex-col gap-2.5 text-sm sm:text-base" style={{ color: 'var(--ink)' }}>
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3">
                            <span
                              className="font-mono font-bold select-none"
                              style={{ color: 'var(--accent-ink)', opacity: 0.8 }}
                            >
                              —
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.chips.map((chip) => (
                          <span
                            key={chip}
                            className="font-mono text-xs font-medium px-2.5 py-1 rounded-md"
                            style={{
                              backgroundColor: 'var(--canvas-base)',
                              border: '1px solid var(--border)',
                              color: 'var(--ink)',
                            }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
