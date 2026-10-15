import { Project } from '@/config/site';

export type GameState = 'START' | 'PLAYING' | 'DISCOVERY' | 'GAME_OVER' | 'COMPLETED';

export type ObstacleType = 'BUG_SPIKE' | 'MERGE_CONFLICT' | 'SERVER_STACK';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  passed: boolean;
}

export interface CollectibleToken {
  id: string;
  projectSlug: string;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  pulsePhase: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'square' | 'circle' | 'spark';
}

export interface ProjectMilestone {
  slug: string;
  triggerDistance: number;
  tokenSpawnDistance: number;
  project: Project;
  ndaNotice?: string;
  keyFeatures: string[];
}
