import type { Metadata } from 'next';
import CanvasExperience from '@/components/game/CanvasExperience';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Project Discovery Runner — ${siteConfig.name}`,
  description:
    'An interactive, playable portfolio runner game to discover projects by Muhammad Umer Farooq.',
};

export default function CanvasPage() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <CanvasExperience />
    </main>
  );
}

