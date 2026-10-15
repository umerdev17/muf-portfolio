'use client';

import { useState } from 'react';
import ProjectDiscoveryGame from './ProjectDiscoveryGame';
import DeskCanvas from '@/components/DeskCanvas';
import ThemeToggle from '@/components/ThemeToggle';

export default function CanvasExperience() {
  const [mode, setMode] = useState<'runner' | 'desk'>('runner');

  const headerSlot = (
    <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
      <button
        type="button"
        onClick={() => setMode(mode === 'runner' ? 'desk' : 'runner')}
        className="desk-btn px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all min-h-[36px]"
        style={{
          backgroundColor: 'var(--surface)',
          border: 'var(--bw) solid var(--border)',
          boxShadow: 'var(--shadow-hard)',
          color: 'var(--ink)',
        }}
        title={mode === 'runner' ? 'Switch to Draggable Desk View' : 'Switch to Playable Discovery Runner'}
        aria-label={mode === 'runner' ? 'Switch to Desk Mode' : 'Switch to Runner Game'}
      >
        <span className="sm:hidden">{mode === 'runner' ? '🖥️ Desk' : '🏃 Run'}</span>
        <span className="hidden sm:inline">{mode === 'runner' ? '🖥️ Desk Mode' : '🏃 Runner Game'}</span>
      </button>

      <ThemeToggle />
    </div>
  );

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col bg-[var(--canvas-base)]">
      {/* Main Experience with unified header slot */}
      <div className="flex-1 w-full h-full min-h-0">
        {mode === 'runner' ? (
          <ProjectDiscoveryGame headerSlot={headerSlot} />
        ) : (
          <DeskCanvas headerSlot={headerSlot} />
        )}
      </div>
    </div>
  );
}
