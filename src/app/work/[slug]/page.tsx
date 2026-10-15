import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import ProjectCarousel from '@/components/ProjectCarousel';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return siteConfig.projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = siteConfig.projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: `Project Not Found — ${siteConfig.name}`,
    };
  }

  return {
    title: `${project.name} — ${siteConfig.name}`,
    description: project.lede,
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = siteConfig.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main id="top" className="min-h-screen flex flex-col">
      <TopBar />

      <article className="flex-1 max-w-[880px] mx-auto w-full pt-32 pb-24 px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold hover:underline decoration-2"
            style={{ color: 'var(--ink-subtle)' }}
          >
            <span>←</span>
            <span>Back to all work</span>
          </Link>
        </div>

        {/* Eyebrow */}
        <p
          className="font-mono text-xs sm:text-sm uppercase tracking-widest font-bold mb-3"
          style={{ color: 'var(--ink-subtle)' }}
        >
          {project.year} · {project.type.toUpperCase()}
        </p>

        {/* H1 Name */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
          style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
        >
          {project.name}
        </h1>

        {/* Tagline */}
        <p
          className="text-xl sm:text-2xl font-medium mb-4"
          style={{ color: 'var(--ink-muted)' }}
        >
          {project.tagline}
        </p>

        {/* Optional Award Chip */}
        {project.award && (
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: '1px solid var(--border)',
                boxShadow: '2px 2px 0 0 var(--border)',
              }}
            >
              🏆 {project.award}
            </span>
          </div>
        )}

        {/* Lede */}
        <p
          className="text-base sm:text-xl leading-relaxed mb-8"
          style={{ color: 'var(--ink)', maxWidth: 'var(--measure)' }}
        >
          {project.lede}
        </p>

        {/* Interactive Device Mockup Carousel */}
        <ProjectCarousel project={project} />

        {/* What It Does Section */}
        <div className="mt-14 mb-12">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-6 pb-2 border-b"
            style={{ color: 'var(--ink)', borderColor: 'var(--border)' }}
          >
            What it does
          </h2>

          <ul className="flex flex-col gap-3.5 text-base sm:text-lg" style={{ color: 'var(--ink)' }}>
            {project.metrics?.map((metric, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span
                  className="font-mono font-bold select-none text-base"
                  style={{ color: 'var(--accent-ink)', opacity: 0.8 }}
                >
                  —
                </span>
                <span>{metric}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Built With Chips */}
        <div className="mb-14">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-6 pb-2 border-b"
            style={{ color: 'var(--ink)', borderColor: 'var(--border)' }}
          >
            Built with
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {project.chips.map((chip) => (
              <span key={chip} className="desk-chip text-sm sm:text-base font-mono">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Live Action & Back Pills */}
        <div className="flex flex-wrap items-center gap-4 py-8 border-y" style={{ borderColor: 'var(--canvas-grid)' }}>
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="desk-btn px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 'var(--bw) solid var(--border)',
                boxShadow: 'var(--shadow-hard)',
              }}
            >
              <span>Live Demo</span>
              <span>↗</span>
            </a>
          ) : (
            <span
              className="px-5 py-2.5 rounded-full text-sm font-mono border"
              style={{
                backgroundColor: 'var(--canvas-base)',
                borderColor: 'var(--canvas-grid)',
                color: 'var(--ink-subtle)',
              }}
            >
              Status: [ Development Prototype ]
            </span>
          )}

          <Link
            href="/work"
            className="desk-btn ml-auto px-5 py-2.5 rounded-full text-sm font-bold"
          >
            <span>← All Work</span>
          </Link>
        </div>
      </article>

      <ContactSection />
      <Footer />
    </main>
  );
}
