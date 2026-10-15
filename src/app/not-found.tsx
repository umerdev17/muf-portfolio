import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: 'var(--canvas-base)',
        backgroundImage:
          'linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    >
      <div
        className="desk-card max-w-lg w-full p-8 sm:p-12 text-center"
        style={{
          backgroundColor: 'var(--surface)',
          border: 'var(--bw) solid var(--border)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-hard-lg)',
        }}
      >
        <p
          className="font-mono text-xs sm:text-sm uppercase tracking-widest font-bold mb-4"
          style={{ color: 'var(--ink-subtle)' }}
        >
          ERROR 404 · NOT FOUND
        </p>

        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          style={{ color: 'var(--ink)' }}
        >
          This page took a personal day.
        </h1>

        <p className="text-base sm:text-lg mb-8" style={{ color: 'var(--ink-muted)' }}>
          It&apos;ll be back. Meanwhile:
        </p>

        <Link
          href="/"
          className="desk-btn px-6 py-3 rounded-full text-base font-bold inline-flex items-center gap-2"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-ink)',
            border: 'var(--bw) solid var(--border)',
            boxShadow: 'var(--shadow-hard)',
          }}
        >
          <span>← Back to the desk</span>
        </Link>
      </div>
    </main>
  );
}
