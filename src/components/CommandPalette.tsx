'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Projects' | 'Actions' | 'Socials';
  label: string;
  sublabel?: string;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedNote, setCopiedNote] = useState('');
  const router = useRouter();

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const close = () => {
    setIsOpen(false);
    setSearch('');
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      label: 'Home / Top',
      sublabel: 'Scroll back to the top',
      shortcut: 'H',
      action: () => {
        router.push('/#top');
        close();
      },
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      label: 'About Umer',
      sublabel: 'Bio, philosophy & background',
      shortcut: 'A',
      action: () => {
        router.push('/#about');
        close();
      },
    },
    {
      id: 'nav-skills',
      category: 'Navigation',
      label: 'Toolbox / Skills',
      sublabel: 'Languages, frameworks & databases',
      shortcut: 'S',
      action: () => {
        router.push('/#skills');
        close();
      },
    },
    {
      id: 'nav-experience',
      category: 'Navigation',
      label: 'Experience & History',
      sublabel: 'Internships and development work',
      shortcut: 'E',
      action: () => {
        router.push('/#experience');
        close();
      },
    },
    {
      id: 'nav-work',
      category: 'Navigation',
      label: 'Selected Work',
      sublabel: 'Browse all featured builds',
      shortcut: 'W',
      action: () => {
        router.push('/work');
        close();
      },
    },
    {
      id: 'nav-canvas',
      category: 'Navigation',
      label: 'Play Project Discovery Runner',
      sublabel: 'Interactive runner game & desk canvas',
      shortcut: 'D',
      action: () => {
        router.push('/canvas');
        close();
      },
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      label: 'Contact',
      sublabel: "Let's build something",
      shortcut: 'C',
      action: () => {
        router.push('/#contact');
        close();
      },
    },

    // Projects
    {
      id: 'proj-vendora',
      category: 'Projects',
      label: 'Vendora — Case Study',
      sublabel: 'Storefront & Catalog Browsing App',
      action: () => {
        router.push('/work/vendora');
        close();
      },
    },
    {
      id: 'proj-mutiauction',
      category: 'Projects',
      label: 'MutiAuction — Case Study',
      sublabel: 'Real-Time Multi-Auction System',
      action: () => {
        router.push('/work/mutiauction');
        close();
      },
    },
    {
      id: 'proj-cvtoweb',
      category: 'Projects',
      label: 'CVtoWeb — Case Study',
      sublabel: 'Portfolio Builder from Resumes',
      action: () => {
        router.push('/work/cvtoweb');
        close();
      },
    },

    // Actions
    {
      id: 'act-copy-email',
      category: 'Actions',
      label: 'Copy Email Address',
      sublabel: siteConfig.email,
      action: () => {
        navigator.clipboard.writeText(siteConfig.email);
        setCopiedNote('Email copied to clipboard!');
        setTimeout(() => setCopiedNote(''), 2500);
      },
    },
    {
      id: 'act-download-resume',
      category: 'Actions',
      label: 'Download Résumé PDF',
      sublabel: 'PDF format for recruiters',
      action: () => {
        const a = document.createElement('a');
        a.href = siteConfig.resume;
        a.download = siteConfig.resumeFilename || `${siteConfig.name.replace(/\s+/g, '-')}-Resume.pdf`;
        a.click();
        close();
      },
    },
    {
      id: 'act-toggle-theme',
      category: 'Actions',
      label: 'Toggle Dark / Light Theme',
      sublabel: 'Switch between Cream and Tokyo Night',
      action: () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('desk.theme', next);
      },
    },

    // Socials
    {
      id: 'soc-linkedin',
      category: 'Socials',
      label: 'Open LinkedIn Profile',
      sublabel: 'Connect with Umer',
      action: () => {
        window.open(siteConfig.linkedin, '_blank');
        close();
      },
    },
  ];

  const filtered = commands.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.label.toLowerCase().includes(q) ||
      c.sublabel?.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });



  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <>
      {/* Quick Trigger Button in TopBar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Command Palette (Cmd+K)"
        title="Open Command Palette (Cmd+K / Ctrl+K)"
        className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-mono border cursor-pointer transition-transform hover:-translate-y-0.5 min-w-[36px] min-h-[36px]"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-hard)',
          color: 'var(--ink-subtle)',
        }}
      >
        <span className="sm:hidden text-xs">⌘K</span>
        <span className="hidden sm:inline">⌘K</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Menu"
          onClick={close}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-28 px-3 sm:px-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="desk-card w-full max-w-xl overflow-hidden flex flex-col max-h-[75vh]"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-hard-lg)',
            }}
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--canvas-grid)' }}>
              <span className="font-mono text-base font-bold select-none" style={{ color: 'var(--ink-subtle)' }}>
                ❯
              </span>
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="w-full bg-transparent outline-none text-base sm:text-lg font-medium"
                style={{ color: 'var(--ink)' }}
              />
              <span className="font-mono text-xs px-2 py-0.5 rounded border border-black/20 text-black/50 dark:border-white/20 dark:text-white/50 select-none">
                ESC
              </span>
            </div>

            {/* Notification alert if copied */}
            {copiedNote && (
              <div
                className="px-4 py-2 text-xs font-mono font-bold flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-ink)',
                }}
              >
                <span>{copiedNote}</span>
                <span>[✓]</span>
              </div>
            )}

            {/* Results List */}
            <div className="overflow-y-auto p-2 divide-y divide-dashed divide-black/5 dark:divide-white/5">
              {filtered.length === 0 ? (
                <div className="p-8 text-center font-mono text-sm" style={{ color: 'var(--ink-subtle)' }}>
                  No commands matching &quot;{search}&quot;.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className="w-full text-left px-3.5 py-3 rounded-lg flex items-center justify-between transition-all cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? 'var(--canvas-base)' : 'transparent',
                        border: isSelected ? '1px solid var(--border)' : '1px solid transparent',
                        color: 'var(--ink)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: isSelected ? 'var(--accent)' : 'var(--canvas-grid)',
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm sm:text-base">{item.label}</span>
                          {item.sublabel && (
                            <span className="text-xs font-mono" style={{ color: 'var(--ink-subtle)' }}>
                              {item.sublabel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: 'var(--canvas-base)',
                            color: 'var(--ink-subtle)',
                            border: '1px solid var(--canvas-grid)',
                          }}
                        >
                          {item.category}
                        </span>
                        {item.shortcut && (
                          <span className="hidden sm:inline-block font-mono text-xs font-bold text-black/40 dark:text-white/40">
                            {item.shortcut}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Legend */}
            <div
              className="p-3 border-t flex items-center justify-between font-mono text-[11px]"
              style={{
                borderColor: 'var(--canvas-grid)',
                backgroundColor: 'rgba(0,0,0,0.02)',
                color: 'var(--ink-subtle)',
              }}
            >
              <div className="flex items-center gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
              <div>{siteConfig.name.toUpperCase()}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
