'use client';

import { useState } from 'react';
import { Project } from '@/config/site';

interface ProjectCarouselProps {
  project: Project;
}

export default function ProjectCarousel({ project }: ProjectCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const getSlides = () => {
    if (project.slug === 'vendora') {
      return [
        {
          title: 'Storefront & Category Navigation',
          tag: 'Catalog UI',
          desc: 'Modular React 19 storefront with CategoryBar filtering and responsive product grid layout.',
        },
        {
          title: 'Dynamic Product Detail Routing',
          tag: 'Client Routing',
          desc: 'Client-side navigation with React Router v7 and useParams displaying vendor, price, and specs.',
        },
        {
          title: 'Modular CSS Design System',
          tag: 'Performance',
          desc: 'Zero-runtime-overhead custom modular CSS styles ensuring fast, clean component rendering.',
        },
      ];
    }
    if (project.slug === 'mutiauction') {
      return [
        {
          title: 'Multi-Vertical Marketplace Discovery',
          tag: 'App Router Views',
          desc: 'Dedicated search and faceted browsing across Vehicles (/cars), Properties (/properties), and Goods.',
        },
        {
          title: 'Physical Inspection Booking Suite',
          tag: 'Verified Inspections',
          desc: '7-step inspection booking wizard and 5-stage appointment tracking timeline for Cars and Properties.',
        },
        {
          title: 'Privacy-Preserving Bidding Architecture',
          tag: 'Bidding System',
          desc: 'Masked public bid logs (Bidder ••••84) preventing buyer collusion, paired with 7-step Sell Wizard.',
        },
      ];
    }
    // Default for cvtoweb
    return [
      {
        title: 'Drag-and-Drop Resume Ingestion',
        tag: 'File Upload',
        desc: 'Accessible dropzone supporting PDF and DOCX formats with client-side type and 10MB size validation.',
      },
      {
        title: 'Multi-Section Data Review Editor',
        tag: 'Interactive Review',
        desc: 'Context-driven editor to inspect, customize, and enrich parsed career and education milestones.',
      },
      {
        title: 'Categorized Template Gallery',
        tag: 'Theme Engine',
        desc: 'Selectable responsive themes (Professional, Minimal, Developer, Creative) with instant visual previews.',
      },
    ];
  };

  const slides = getSlides();
  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="w-full my-10">
      {/* Device Frame */}
      <div
        className="desk-card p-3 sm:p-4 rounded-2xl overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--surface)',
          border: 'var(--bw) solid var(--border)',
          boxShadow: 'var(--shadow-hard-lg)',
        }}
      >
        {/* Frame Top Bar */}
        <div className="flex items-center justify-between pb-3 px-2 border-b" style={{ borderColor: 'var(--canvas-grid)' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-black/20 bg-red-400" />
            <span className="w-3 h-3 rounded-full border border-black/20 bg-amber-400" />
            <span className="w-3 h-3 rounded-full border border-black/20 bg-emerald-400" />
          </div>
          <div
            className="px-3 py-1 rounded-md text-xs font-mono select-none truncate max-w-[150px] sm:max-w-none"
            style={{
              backgroundColor: 'var(--canvas-base)',
              border: '1px solid var(--canvas-grid)',
              color: 'var(--ink-subtle)',
            }}
          >
            https://{project.slug}.demo.internal
          </div>
          <div className="w-12 text-right font-mono text-[11px]" style={{ color: 'var(--ink-subtle)' }}>
            v1.0
          </div>
        </div>

        {/* Device Screen Area (16:10 Aspect) */}
        <div
          className="relative w-full aspect-[16/10] min-h-[220px] rounded-xl overflow-hidden mt-3 flex flex-col justify-between p-3.5 sm:p-10 select-none transition-all duration-300"
          style={{
            backgroundColor: 'var(--canvas-base)',
            backgroundImage:
              'linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header Tag inside device */}
          <div className="flex items-center justify-between">
            <span
              className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: '1px solid var(--border)',
              }}
            >
              {slides[currentSlide].tag}
            </span>
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--ink-subtle)' }}>
              SLIDE // 0{currentSlide + 1}
            </span>
          </div>

          {/* Central Mockup Visual */}
          <div className="my-auto text-center max-w-lg mx-auto py-2 sm:py-4">
            <div
              className="inline-block p-3 sm:p-6 rounded-2xl mb-1 sm:mb-4"
              style={{
                backgroundColor: 'var(--surface)',
                border: 'var(--bw) solid var(--border)',
                boxShadow: 'var(--shadow-hard)',
              }}
            >
              <h4 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--ink)' }}>
                {slides[currentSlide].title}
              </h4>
              <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                {slides[currentSlide].desc}
              </p>
            </div>
          </div>

          {/* Mockup footer indicator */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono gap-2" style={{ color: 'var(--ink-subtle)' }}>
            <span className="truncate">STACK: {project.chips.slice(0, 3).join(' · ')}</span>
            <span className="hidden xs:inline shrink-0">PREVIEW</span>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center justify-between mt-5 px-2">
        {/* Yellow Dots Indicator */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="w-4 h-4 rounded-full border transition-all cursor-pointer p-0"
              style={{
                backgroundColor: currentSlide === idx ? 'var(--accent)' : 'var(--surface)',
                borderColor: 'var(--border)',
                boxShadow: currentSlide === idx ? '1px 1px 0 0 var(--border)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="font-mono text-xs sm:text-sm font-bold" style={{ color: 'var(--ink)' }}>
          {currentSlide + 1} / {totalSlides}
        </div>

        {/* Prev / Next Circular Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center font-bold cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: '2px 2px 0 0 var(--border)',
              color: 'var(--ink)',
            }}
          >
            ←
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center font-bold cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: '2px 2px 0 0 var(--border)',
              color: 'var(--ink)',
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
