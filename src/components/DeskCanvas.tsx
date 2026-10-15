'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';

interface WindowCard {
  id: string;
  title: string;
  color: string;
  colorSoft: string;
  x: number;
  y: number;
  isOpen: boolean;
  zIndex: number;
}

interface DeskCanvasProps {
  headerSlot?: React.ReactNode;
}

export default function DeskCanvas({ headerSlot }: DeskCanvasProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setTopZ] = useState(10);
  const [activeTheme, setActiveTheme] = useState('cream');
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Available Themes
  const themes = [
    { name: 'Cream (Default)', id: 'cream', bg: '#F7F5EE', border: '#161616', accent: '#FACC00' },
    { name: 'Tokyo Night', id: 'tokyo-night', bg: '#1A1B26', border: '#C0CAF5', accent: '#E0AF68' },
    { name: 'Catppuccin Mocha', id: 'mocha', bg: '#1E1E2E', border: '#CDD6F4', accent: '#F9E2AF' },
    { name: 'Gruvbox Dark', id: 'gruvbox-dark', bg: '#282828', border: '#EBDBB2', accent: '#FABD2F' },
    { name: 'Dracula', id: 'dracula', bg: '#282A36', border: '#F8F8F2', accent: '#F1FA8C' },
    { name: 'Nord', id: 'nord', bg: '#2E3440', border: '#ECEFF4', accent: '#EBCB8B' },
  ];

  const switchTheme = (themeId: string) => {
    setActiveTheme(themeId);
    if (themeId === 'cream') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('desk.theme', themeId === 'cream' ? 'light' : 'dark');
  };

  // Sound Engine
  const toggleSound = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const nextState = !soundPlaying;
    setSoundPlaying(nextState);

    if (nextState) {
      playChime(523.25); // C5
      setTimeout(() => playChime(659.25), 180); // E5
      setTimeout(() => playChime(783.99), 360); // G5
    }
  };

  const playChime = (freq: number) => {
    if (!audioCtxRef.current) return;
    try {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.4);
    } catch {}
  };

  // Initial Window Positions
  const [windows, setWindows] = useState<WindowCard[]>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return [
        { id: 'about', title: 'About', color: '#FACC00', colorSoft: '#FEF3BF', x: 12, y: 65, isOpen: true, zIndex: 1 },
        { id: 'work', title: 'Work', color: '#A8E6A1', colorSoft: '#E4F7E1', x: 16, y: 90, isOpen: true, zIndex: 2 },
        { id: 'experience', title: 'Experience', color: '#FFB4A2', colorSoft: '#FFE6DF', x: 12, y: 115, isOpen: false, zIndex: 3 },
        { id: 'stack', title: 'Toolbox & Stack', color: '#A9D6FF', colorSoft: '#E3F1FF', x: 16, y: 140, isOpen: false, zIndex: 4 },
        { id: 'themes', title: 'Themes', color: '#FFC2E2', colorSoft: '#FFE7F3', x: 12, y: 165, isOpen: false, zIndex: 5 },
      ];
    }
    return [
      { id: 'about', title: 'About', color: '#FACC00', colorSoft: '#FEF3BF', x: 60, y: 90, isOpen: true, zIndex: 1 },
      { id: 'work', title: 'Work', color: '#A8E6A1', colorSoft: '#E4F7E1', x: 520, y: 90, isOpen: true, zIndex: 2 },
      { id: 'experience', title: 'Experience', color: '#FFB4A2', colorSoft: '#FFE6DF', x: 100, y: 380, isOpen: true, zIndex: 3 },
      { id: 'stack', title: 'Toolbox & Stack', color: '#A9D6FF', colorSoft: '#E3F1FF', x: 620, y: 360, isOpen: true, zIndex: 4 },
      { id: 'themes', title: 'Themes', color: '#FFC2E2', colorSoft: '#FFE7F3', x: 280, y: 200, isOpen: false, zIndex: 5 },
    ];
  });

  const bringToFront = (id: string) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setWindows((list) =>
        list.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isOpen: true } : w))
      );
      playChime(720 + (nextZ % 6) * 35);
      return nextZ;
    });
  };

  const closeWindow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((list) =>
      list.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  };

  const toggleWindow = (id: string) => {
    const target = windows.find((w) => w.id === id);
    if (!target) return;
    if (target.isOpen) {
      bringToFront(id);
    } else {
      setTopZ((prev) => {
        const nextZ = prev + 1;
        setWindows((list) =>
          list.map((w) => (w.id === id ? { ...w, isOpen: true, zIndex: nextZ } : w))
        );
        return nextZ;
      });
    }
  };

  const arrangeDefault = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    if (isMobile) {
      setWindows([
        { id: 'about', title: 'About', color: '#FACC00', colorSoft: '#FEF3BF', x: 12, y: 65, isOpen: true, zIndex: 1 },
        { id: 'work', title: 'Work', color: '#A8E6A1', colorSoft: '#E4F7E1', x: 16, y: 90, isOpen: true, zIndex: 2 },
        { id: 'experience', title: 'Experience', color: '#FFB4A2', colorSoft: '#FFE6DF', x: 12, y: 115, isOpen: false, zIndex: 3 },
        { id: 'stack', title: 'Toolbox & Stack', color: '#A9D6FF', colorSoft: '#E3F1FF', x: 16, y: 140, isOpen: false, zIndex: 4 },
        { id: 'themes', title: 'Themes', color: '#FFC2E2', colorSoft: '#FFE7F3', x: 12, y: 165, isOpen: false, zIndex: 5 },
      ]);
    } else {
      setWindows([
        { id: 'about', title: 'About', color: '#FACC00', colorSoft: '#FEF3BF', x: 60, y: 90, isOpen: true, zIndex: 1 },
        { id: 'work', title: 'Work', color: '#A8E6A1', colorSoft: '#E4F7E1', x: 520, y: 90, isOpen: true, zIndex: 2 },
        { id: 'experience', title: 'Experience', color: '#FFB4A2', colorSoft: '#FFE6DF', x: 100, y: 400, isOpen: true, zIndex: 3 },
        { id: 'stack', title: 'Toolbox & Stack', color: '#A9D6FF', colorSoft: '#E3F1FF', x: 620, y: 380, isOpen: true, zIndex: 4 },
        { id: 'themes', title: 'Themes', color: '#FFC2E2', colorSoft: '#FFE7F3', x: 300, y: 220, isOpen: false, zIndex: 5 },
      ]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--canvas-base)',
        backgroundImage:
          'linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    >
      {/* Top Bar for Canvas */}
      <header className="absolute top-0 left-0 right-0 z-40 h-14 px-2.5 sm:px-6 flex items-center justify-between border-b backdrop-blur-xs gap-1.5 sm:gap-3" style={{ borderColor: 'var(--canvas-grid)', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="desk-btn px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 min-h-[36px]"
          >
            <span>←</span>
            <span className="hidden sm:inline">Standard Site</span>
          </Link>

          <span
            className="hidden md:inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-ink)',
            }}
          >
            DESK CANVAS // v2
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle retro synthesizer sound"
            className="desk-btn px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 min-h-[36px]"
          >
            <span className="sm:hidden">{soundPlaying ? '🔊' : '🔈'}</span>
            <span className="hidden sm:inline">{soundPlaying ? '🔊 SOUND: ON' : '🔈 SOUND: OFF'}</span>
          </button>

          <button
            type="button"
            onClick={arrangeDefault}
            title="Reset Desk Window Layout"
            className="desk-btn px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold min-h-[36px]"
          >
            <span className="sm:hidden">↺</span>
            <span className="hidden sm:inline">Reset Layout ↺</span>
          </button>

          {headerSlot}
        </div>
      </header>

      {/* DRAGGABLE WINDOWS */}

      {/* 1. About Window */}
      {windows.find((w) => w.id === 'about')?.isOpen && (
        <motion.div
          drag
          dragConstraints={containerRef}
          onMouseDown={() => bringToFront('about')}
          style={{
            zIndex: windows.find((w) => w.id === 'about')?.zIndex,
            left: windows.find((w) => w.id === 'about')?.x,
            top: windows.find((w) => w.id === 'about')?.y,
          }}
          className="absolute w-[calc(100vw-24px)] sm:w-[440px] max-w-[440px] desk-card p-0 cursor-grab active:cursor-grabbing"
        >
          {/* Window Title Bar */}
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between rounded-t-xl"
            style={{
              backgroundColor: '#FEF3BF',
              borderColor: 'var(--border)',
              color: '#161616',
            }}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FACC00] border border-black/30" />
              <span>About // {siteConfig.name}</span>
            </div>
            <button
              type="button"
              onClick={(e) => closeWindow('about', e)}
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs hover:bg-black/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Window Body */}
          <div className="p-5 flex flex-col gap-3 text-sm leading-relaxed" style={{ backgroundColor: 'var(--surface)', color: 'var(--ink)' }}>
            <p className="font-semibold text-base">
              Hi, I&apos;m {siteConfig.name}. A full-stack developer based in Pakistan.
            </p>
            <p style={{ color: 'var(--ink-muted)' }}>
              I focus on building modern web applications, responsive interfaces, and practical software solutions using AI-assisted development workflows across React, Next.js, Node.js, and MongoDB.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="desk-chip text-xs">
                LinkedIn ↗
              </a>
              <a href={`mailto:${siteConfig.email}`} className="desk-chip text-xs font-bold" style={{ backgroundColor: 'var(--accent)' }}>
                Email Me ↗
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Work Window */}
      {windows.find((w) => w.id === 'work')?.isOpen && (
        <motion.div
          drag
          dragConstraints={containerRef}
          onMouseDown={() => bringToFront('work')}
          style={{
            zIndex: windows.find((w) => w.id === 'work')?.zIndex,
            left: windows.find((w) => w.id === 'work')?.x,
            top: windows.find((w) => w.id === 'work')?.y,
          }}
          className="absolute w-[calc(100vw-24px)] sm:w-[480px] max-w-[480px] desk-card p-0 cursor-grab active:cursor-grabbing"
        >
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between rounded-t-xl"
            style={{
              backgroundColor: '#E4F7E1',
              borderColor: 'var(--border)',
              color: '#161616',
            }}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8E6A1] border border-black/30" />
              <span>Selected Work ({siteConfig.projects.length})</span>
            </div>
            <button
              type="button"
              onClick={(e) => closeWindow('work', e)}
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs hover:bg-black/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-4 flex flex-col gap-2.5 divide-y divide-dashed divide-black/10" style={{ backgroundColor: 'var(--surface)' }}>
            {siteConfig.projects.map((proj) => (
              <div key={proj.slug} className="pt-2 first:pt-0 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-1.5 rounded bg-black/5 dark:bg-white/10">
                      {proj.index}
                    </span>
                    <span className="font-bold text-sm" style={{ color: 'var(--ink)' }}>
                      {proj.name}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--ink-muted)' }}>
                    {proj.tagline}
                  </p>
                </div>

                <Link
                  href={`/work/${proj.slug}`}
                  className="desk-btn px-2.5 py-1 text-xs rounded-md font-bold"
                >
                  Open →
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Experience Window */}
      {windows.find((w) => w.id === 'experience')?.isOpen && (
        <motion.div
          drag
          dragConstraints={containerRef}
          onMouseDown={() => bringToFront('experience')}
          style={{
            zIndex: windows.find((w) => w.id === 'experience')?.zIndex,
            left: windows.find((w) => w.id === 'experience')?.x,
            top: windows.find((w) => w.id === 'experience')?.y,
          }}
          className="absolute w-[calc(100vw-24px)] sm:w-[440px] max-w-[440px] desk-card p-0 cursor-grab active:cursor-grabbing"
        >
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between rounded-t-xl"
            style={{
              backgroundColor: '#FFE6DF',
              borderColor: 'var(--border)',
              color: '#161616',
            }}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB4A2] border border-black/30" />
              <span>Career &amp; Education</span>
            </div>
            <button
              type="button"
              onClick={(e) => closeWindow('experience', e)}
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs hover:bg-black/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-4 flex flex-col gap-3 text-sm" style={{ backgroundColor: 'var(--surface)', color: 'var(--ink)' }}>
            <div>
              <div className="font-mono text-xs font-bold opacity-60">2026 – PRESENT</div>
              <div className="font-bold text-sm sm:text-base">Software Development Intern</div>
              <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>Digital Elliptical</div>
              <p className="text-xs mt-1 leading-normal" style={{ color: 'var(--ink-subtle)' }}>
                Full-stack development and AI-assisted application building while collaborating with a team.
              </p>
            </div>

            <div className="pt-2 border-t border-dashed" style={{ borderColor: 'var(--canvas-grid)' }}>
              <div className="font-mono text-xs font-bold opacity-60">2025 · APPROX. 3 MONTHS</div>
              <div className="font-bold text-sm">Call Center Agent</div>
              <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>Riuman International</div>
              <p className="text-xs mt-1 leading-normal" style={{ color: 'var(--ink-subtle)' }}>
                Customer communications and call-center voice support operations.
              </p>
            </div>

            <div className="pt-2 border-t border-dashed" style={{ borderColor: 'var(--canvas-grid)' }}>
              <div className="font-mono text-xs font-bold opacity-60">CURRENT</div>
              <div className="font-bold text-sm">First-year ICS (Computer Science)</div>
              <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>Government Boys Degree College Kohsar</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. Toolbox & Stack Window */}
      {windows.find((w) => w.id === 'stack')?.isOpen && (
        <motion.div
          drag
          dragConstraints={containerRef}
          onMouseDown={() => bringToFront('stack')}
          style={{
            zIndex: windows.find((w) => w.id === 'stack')?.zIndex,
            left: windows.find((w) => w.id === 'stack')?.x,
            top: windows.find((w) => w.id === 'stack')?.y,
          }}
          className="absolute w-[calc(100vw-24px)] sm:w-[460px] max-w-[460px] desk-card p-0 cursor-grab active:cursor-grabbing"
        >
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between rounded-t-xl"
            style={{
              backgroundColor: '#E3F1FF',
              borderColor: 'var(--border)',
              color: '#161616',
            }}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A9D6FF] border border-black/30" />
              <span>Full-Stack Toolbox</span>
            </div>
            <button
              type="button"
              onClick={(e) => closeWindow('stack', e)}
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs hover:bg-black/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-4 flex flex-col gap-3 text-xs" style={{ backgroundColor: 'var(--surface)' }}>
            {siteConfig.skills.map((s) => (
              <div key={s.category}>
                <div className="font-mono font-bold mb-1 opacity-70" style={{ color: 'var(--ink)' }}>
                  {s.category}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.tools.map((t) => (
                    <span key={t} className="desk-chip text-[11px] py-1 px-2">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. Themes Selector Window */}
      {windows.find((w) => w.id === 'themes')?.isOpen && (
        <motion.div
          drag
          dragConstraints={containerRef}
          onMouseDown={() => bringToFront('themes')}
          style={{
            zIndex: windows.find((w) => w.id === 'themes')?.zIndex,
            left: windows.find((w) => w.id === 'themes')?.x,
            top: windows.find((w) => w.id === 'themes')?.y,
          }}
          className="absolute w-[calc(100vw-24px)] sm:w-[420px] max-w-[420px] desk-card p-0 cursor-grab active:cursor-grabbing"
        >
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between rounded-t-xl"
            style={{
              backgroundColor: '#FFE7F3',
              borderColor: 'var(--border)',
              color: '#161616',
            }}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC2E2] border border-black/30" />
              <span>Live Desk Themes</span>
            </div>
            <button
              type="button"
              onClick={(e) => closeWindow('themes', e)}
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs hover:bg-black/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-4 grid grid-cols-2 gap-2.5" style={{ backgroundColor: 'var(--surface)' }}>
            {themes.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => switchTheme(th.id)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
                  activeTheme === th.id ? 'ring-2 ring-[var(--accent)] font-bold' : ''
                }`}
                style={{
                  backgroundColor: th.bg,
                  borderColor: th.border,
                  color: th.border,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.accent }} />
                  <span className="text-xs truncate">{th.name}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* DOCK BAR AT BOTTOM */}
      <footer
        className="absolute left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-16px)]"
        style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl shadow-2xl backdrop-blur-md overflow-x-auto max-w-full"
          style={{
            backgroundColor: 'var(--surface)',
            border: 'var(--bw) solid var(--border)',
            boxShadow: 'var(--shadow-hard-lg)',
          }}
        >
          {windows.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => toggleWindow(w.id)}
              aria-label={`Toggle ${w.title}`}
              className="relative p-1.5 sm:p-2 min-w-[44px] min-h-[44px] rounded-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center shrink-0"
              style={{
                backgroundColor: w.isOpen ? w.colorSoft : 'transparent',
                border: w.isOpen ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <span className="text-base sm:text-lg">
                {w.id === 'about' && '👤'}
                {w.id === 'work' && '💼'}
                {w.id === 'experience' && '📜'}
                {w.id === 'stack' && '⚡'}
                {w.id === 'themes' && '🎨'}
              </span>
              <span className="text-[10px] font-mono font-bold mt-0.5 text-black dark:text-white">
                {w.title.split(' ')[0]}
              </span>
              {w.isOpen && (
                <span
                  className="w-1.5 h-1.5 rounded-full absolute bottom-0.5"
                  style={{ backgroundColor: w.color }}
                />
              )}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
