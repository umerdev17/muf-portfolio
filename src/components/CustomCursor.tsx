'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check if device supports fine pointer and hover (desktop mouse/trackpad)
    const mediaHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mediaHover.matches) {
      return;
    }

    const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Enable body class to hide native cursor on desktop
    document.body.classList.add('custom-cursor-enabled');

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let isHovering = false;
    let isTextInput = false;
    let isMouseDown = false;
    let rafId: number | null = null;

    // Interactive element detection
    const checkInteractive = (target: Element | null): boolean => {
      if (!target) return false;
      return Boolean(
        target.closest(
          'a, button, [role="button"], input[type="submit"], input[type="button"], .desk-btn, .desk-chip, .desk-card, [data-cursor="interactive"], summary, [tabindex]:not([tabindex="-1"])'
        )
      );
    };

    // Text input detection
    const checkTextInput = (target: Element | null): boolean => {
      if (!target) return false;
      const tag = target.tagName.toLowerCase();
      if (tag === 'textarea') return true;
      if (tag === 'input') {
        const type = (target as HTMLInputElement).type?.toLowerCase();
        return !['button', 'submit', 'checkbox', 'radio', 'range', 'file'].includes(type);
      }
      return (target as HTMLElement).isContentEditable;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = mouseX;
        currentY = mouseY;
      }

      // Check target element under cursor
      const target = document.elementFromPoint(e.clientX, e.clientY);
      isTextInput = checkTextInput(target);
      isHovering = !isTextInput && checkInteractive(target);
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    const onMouseEnter = (e: MouseEvent) => {
      isVisible = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      currentX = mouseX;
      currentY = mouseY;
    };

    const onWindowBlur = () => {
      isVisible = false;
    };

    // Delta-time corrected smooth gliding loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (mediaReducedMotion.matches) {
        currentX = mouseX;
        currentY = mouseY;
      } else {
        // Tuned gliding interpolation (~0.16 per 60fps frame for silky inertia)
        const lerpTarget = 0.16;
        const factor = 1 - Math.pow(1 - lerpTarget, Math.max(dt * 60, 0.1));
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;

        if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
          currentX = mouseX;
          currentY = mouseY;
        } else {
          currentX += dx * factor;
          currentY += dy * factor;
        }
      }

      if (cursor) {
        const scale = isMouseDown ? ' scale(0.85)' : '';
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)${scale}`;

        // Update classes based on state
        if (!isVisible || isTextInput) {
          cursor.className = 'minimal-dot-cursor cursor-hidden';
        } else if (isHovering) {
          cursor.className = 'minimal-dot-cursor cursor-hover';
        } else {
          cursor.className = 'minimal-dot-cursor cursor-default';
        }
      }

      rafId = requestAnimationFrame(render);
    };

    const onScroll = () => {
      if (isVisible) {
        const target = document.elementFromPoint(mouseX, mouseY);
        isTextInput = checkTextInput(target);
        isHovering = !isTextInput && checkInteractive(target);
      }
    };

    // Attach listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('blur', onWindowBlur);

    rafId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('blur', onWindowBlur);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="minimal-dot-cursor cursor-hidden"
    />
  );
}
