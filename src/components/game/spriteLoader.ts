/**
 * Sprite Loader for the MUF Portfolio Runner.
 * Preloads all 15 custom 2D character animation frames generated with Gemini,
 * perfectly anchored to a standardized 320x300 canvas for zero-jitter, continuous 2D motion.
 */

export interface SpriteInfo {
  path: string;
  width: number;
  height: number;
  aspect: number;
  anchorX: number;
  groundY: number;
  renderW: number;
  renderH: number;
  groundOffset: number;
}

export const SPRITE_MANIFEST: Record<string, SpriteInfo> = {
  run_0: { path: '/sprites/runner/run_0.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  run_1: { path: '/sprites/runner/run_1.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  run_2: { path: '/sprites/runner/run_2.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  run_3: { path: '/sprites/runner/run_3.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  run_4: { path: '/sprites/runner/run_4.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  run_5: { path: '/sprites/runner/run_5.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },

  jump_takeoff: { path: '/sprites/runner/jump_takeoff.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  jump_ascend: { path: '/sprites/runner/jump_ascend.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  jump_peak: { path: '/sprites/runner/jump_peak.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  jump_double: { path: '/sprites/runner/jump_double.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  jump_fall: { path: '/sprites/runner/jump_fall.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  jump_land: { path: '/sprites/runner/jump_land.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },

  idle_0: { path: '/sprites/runner/idle_0.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  idle_1: { path: '/sprites/runner/idle_1.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  stumble: { path: '/sprites/runner/stumble.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
  crash: { path: '/sprites/runner/crash.png', width: 128, height: 128, aspect: 1.0, anchorX: 64, groundY: 120, renderW: 56, renderH: 56, groundOffset: 53 },
};

class SpriteManager {
  private images: Map<string, HTMLImageElement> = new Map();
  private loadedCount: number = 0;
  private totalCount: number = Object.keys(SPRITE_MANIFEST).length;
  private isClient: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isClient = true;
      this.preload();
    }
  }

  public preload() {
    if (!this.isClient) return;

    Object.entries(SPRITE_MANIFEST).forEach(([key, info]) => {
      const img = new Image();
      img.src = info.path;
      img.onload = () => {
        this.loadedCount++;
      };
      this.images.set(key, img);
    });
  }

  public getSprite(key: string): HTMLImageElement | null {
    const img = this.images.get(key);
    if (img && img.complete && img.naturalWidth > 0) {
      return img;
    }
    return null;
  }

  public getSpriteInfo(key: string): SpriteInfo | undefined {
    return SPRITE_MANIFEST[key];
  }

  public isReady(): boolean {
    return this.loadedCount >= this.totalCount;
  }
}

export const spriteManager = new SpriteManager();
