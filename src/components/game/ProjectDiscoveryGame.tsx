'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { sound } from './audio';
import { renderPixelCat } from './pixelCat';
import {
  GameState,
  Obstacle,
  ObstacleType,
  CollectibleToken,
  Particle,
  ProjectMilestone,
} from './types';

// Verified project milestones based strictly on siteConfig.projects
const MILESTONES: ProjectMilestone[] = [
  {
    slug: 'vendora',
    triggerDistance: 320,
    tokenSpawnDistance: 270,
    project: siteConfig.projects.find((p) => p.slug === 'vendora') || siteConfig.projects[0],
    keyFeatures: [
      'Component-driven catalog with dynamic routing (/products/:id) and category filters',
      'Zero-runtime modular CSS architecture with structured vendor metadata',
    ],
  },
  {
    slug: 'mutiauction',
    triggerDistance: 740,
    tokenSpawnDistance: 680,
    project: siteConfig.projects.find((p) => p.slug === 'mutiauction') || siteConfig.projects[1],
    ndaNotice: 'Confidential Enterprise Concept — High-level architecture summary compliant with NDA',
    keyFeatures: [
      '38 App Router pages across vehicles, property, and general marketplace verticals with 7-step Sell Wizard',
      'Physical verification workflow for high-ticket assets and privacy-preserving masked bid logs',
    ],
  },
  {
    slug: 'cvtoweb',
    triggerDistance: 1180,
    tokenSpawnDistance: 1120,
    project: siteConfig.projects.find((p) => p.slug === 'cvtoweb') || siteConfig.projects[2],
    keyFeatures: [
      'Accessible drag-and-drop resume ingestion pipeline (PDF/DOCX) with client-side validation',
      'Interactive multi-section review editor and live 4-theme template preview gallery',
    ],
  },
];

interface EngineState {
  gameState: GameState;
  distance: number;
  speed: number;
  baseSpeed: number;
  maxSpeed: number;
  gravity: number;
  jumpVelocity: number;
  isDark: boolean;
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    vy: number;
    isGrounded: boolean;
    jumpCount: number;
    maxJumps: number;
    runFrame: number;
    scarfWave: number;
    landingTimer: number;
  };
  groundY: number;
  obstacles: Obstacle[];
  tokens: CollectibleToken[];
  particles: Particle[];
  lastSpawnX: number;
  discovered: Set<string>;
  nextMilestoneIndex: number;
  lastTime: number;
}

// Standalone Visual Rendering Helpers (Pure Functions Outside Component)

function renderBugBlock(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  isDark: boolean
) {
  const shadowColor = isDark ? '#000000' : '#161616';
  const cardBg = isDark ? '#16161E' : '#FFFFFF';
  const borderColor = isDark ? '#FF4D4D' : '#161616';
  const hazardRed = '#FF3B30';
  const textColor = isDark ? '#FFFFFF' : '#161616';

  // 1. Hard 4px block shadow
  ctx.fillStyle = shadowColor;
  ctx.fillRect(4, 4, obs.width, obs.height);

  // 2. Solid background fill (zero grid bleed)
  ctx.fillStyle = cardBg;
  ctx.fillRect(0, 0, obs.width, obs.height);

  // 3. Danger Color Coding: Bright Hazard Red top bar (13px tall)
  const headerH = 13;
  ctx.fillStyle = hazardRed;
  ctx.fillRect(0, 0, obs.width, headerH);

  // Two mini white indicator squares on top bar
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(4, 5, 3, 3);
  ctx.fillRect(9, 5, 3, 3);

  // Top bar divider line
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, headerH);
  ctx.lineTo(obs.width, headerH);
  ctx.stroke();

  // 4. Big, Clear Typography: bold monospace font at 14px "BUG"
  ctx.fillStyle = textColor;
  ctx.font = '900 14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BUG', obs.width / 2, 28);

  // 5. Thick 2.5px solid border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(0, 0, obs.width, obs.height);
}

function renderPillar404(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  isDark: boolean
) {
  const shadowColor = isDark ? '#000000' : '#161616';
  const cardBg = isDark ? '#16161E' : '#FFFFFF';
  const borderColor = isDark ? '#FF4D4D' : '#161616';
  const hazardRed = '#FF3B30';
  const textColor = isDark ? '#FFFFFF' : '#161616';

  // 1. Hard 4px block shadow
  ctx.fillStyle = shadowColor;
  ctx.fillRect(4, 4, obs.width, obs.height);

  // 2. Solid background fill
  ctx.fillStyle = cardBg;
  ctx.fillRect(0, 0, obs.width, obs.height);

  // 3. Browser error window top bar (16px tall) with red accent
  const headerH = 16;
  ctx.fillStyle = hazardRed;
  ctx.fillRect(0, 0, obs.width, headerH);

  // Three tiny white window dots
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(4, 6, 3, 3);
  ctx.fillRect(9, 6, 3, 3);
  ctx.fillRect(14, 6, 3, 3);

  // Top bar divider line
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, headerH);
  ctx.lineTo(obs.width, headerH);
  ctx.stroke();

  // 4. Big, Clear Typography: large bold 15px "404"
  ctx.fillStyle = textColor;
  ctx.font = '900 15px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('404', obs.width / 2, 36);

  // 5. Lower status badge with blinking LED
  const dividerY = 52;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, dividerY);
  ctx.lineTo(obs.width, dividerY);
  ctx.stroke();

  const isBlinkOn = Math.floor(Date.now() / 250) % 2 === 0;
  ctx.fillStyle = isBlinkOn ? hazardRed : isDark ? '#4A1D24' : '#FAA0A0';
  ctx.beginPath();
  ctx.arc(8, 60, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.font = '900 9px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ERR', 14, 60);

  // 6. Thick 2.5px solid border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(0, 0, obs.width, obs.height);
}

function renderErrBarrier(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  isDark: boolean
) {
  const shadowColor = isDark ? '#000000' : '#161616';
  const cardBg = isDark ? '#16161E' : '#FFFFFF';
  const borderColor = isDark ? '#FF4D4D' : '#161616';
  const hazardRed = '#FF3B30';
  const yellowHazard = '#FACC00';
  const textColor = isDark ? '#FFFFFF' : '#161616';

  // 1. Hard 4px block shadow
  ctx.fillStyle = shadowColor;
  ctx.fillRect(4, 4, obs.width, obs.height);

  // 2. Solid background fill
  ctx.fillStyle = cardBg;
  ctx.fillRect(0, 0, obs.width, obs.height);

  // 3. Bold diagonal hazard stripes along top (12px tall)
  const stripeH = 12;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, obs.width, stripeH);
  ctx.clip();
  ctx.fillStyle = yellowHazard;
  ctx.fillRect(0, 0, obs.width, stripeH);
  ctx.fillStyle = '#161616';
  const stripeOffset = ((obs.animPhase || 0) * 8) % 12;
  for (let sx = -24 + stripeOffset; sx < obs.width + 24; sx += 12) {
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx + 6, 0);
    ctx.lineTo(sx - 2, stripeH);
    ctx.lineTo(sx - 8, stripeH);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Top bar divider line
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, stripeH);
  ctx.lineTo(obs.width, stripeH);
  ctx.stroke();

  // 4. Solid red hazard square accents on left and right
  ctx.fillStyle = hazardRed;
  ctx.fillRect(3, 17, 7, 14);
  ctx.fillRect(obs.width - 10, 17, 7, 14);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(3, 17, 7, 14);
  ctx.strokeRect(obs.width - 10, 17, 7, 14);

  // 5. Big, Clear Typography: Solid ERR badge in the middle with bold 14px monospace font
  ctx.fillStyle = textColor;
  ctx.font = '900 14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ERR', obs.width / 2, 24);

  // 6. Thick 2.5px solid border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(0, 0, obs.width, obs.height);
}

function renderObstacle(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  isDark: boolean
) {
  ctx.save();
  ctx.translate(obs.x, obs.y);

  if (obs.type === 'PILLAR_404' || obs.type === 'SERVER_STACK') {
    renderPillar404(ctx, obs, isDark);
  } else if (
    obs.type === 'ERR_BARRIER' ||
    obs.type === 'MERGE_GATE' ||
    obs.type === 'MERGE_CONFLICT'
  ) {
    renderErrBarrier(ctx, obs, isDark);
  } else {
    // BUG_BLOCK / SYNTAX_BUG / BUG_SPIKE / SCOPE_CREEP / default
    renderBugBlock(ctx, obs, isDark);
  }

  ctx.restore();
}

function renderToken(
  ctx: CanvasRenderingContext2D,
  token: CollectibleToken,
  ink: string,
  accent: string
) {
  ctx.save();
  const bobY = token.y + Math.sin(token.pulsePhase) * 6;
  ctx.translate(token.x, bobY);

  const pulseScale = 1 + Math.sin(token.pulsePhase * 2) * 0.15;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, token.radius * pulseScale, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, token.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#161616';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let glyph = '★';
  if (token.projectSlug === 'vendora') glyph = '01';
  if (token.projectSlug === 'mutiauction') glyph = '02';
  if (token.projectSlug === 'cvtoweb') glyph = '03';

  ctx.fillText(glyph, 0, 1);

  ctx.fillStyle = ink;
  ctx.font = 'bold 9px monospace';
  ctx.fillText('PROJECT', 0, -token.radius - 8);

  ctx.restore();
}

function renderPlayer(
  ctx: CanvasRenderingContext2D,
  engine: EngineState,
  isDark: boolean,
  ink: string,
  accent: string
) {
  renderPixelCat(
    ctx,
    engine.player,
    engine.groundY,
    engine.gameState,
    isDark,
    ink,
    accent
  );
}

function renderWorld(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  engine: EngineState
) {
  const isDark = engine.isDark;
  const bgBase = isDark ? '#1A1B26' : '#F7F5EE';
  const gridLineColor = isDark ? 'rgba(192, 202, 245, 0.06)' : 'rgba(22, 22, 22, 0.06)';
  const inkColor = isDark ? '#C0CAF5' : '#161616';
  const inkSubtle = isDark ? 'rgba(192, 202, 245, 0.45)' : 'rgba(22, 22, 22, 0.45)';
  const accentColor = isDark ? '#E0AF68' : '#FACC00';
  const groundY = engine.groundY;

  // A. Clear background
  ctx.fillStyle = bgBase;
  ctx.fillRect(0, 0, width, height);

  // B. Parallax Graph Paper Grid
  const gridSize = 48;
  const scrollOffset = (engine.distance * 12) % gridSize;

  ctx.save();
  ctx.strokeStyle = gridLineColor;
  ctx.lineWidth = 1;

  for (let x = -scrollOffset; x < width + gridSize; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(Math.floor(x) + 0.5, 0);
    ctx.lineTo(Math.floor(x) + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(y) + 0.5);
    ctx.lineTo(width, Math.floor(y) + 0.5);
    ctx.stroke();
  }

  // Parallax doodles
  const glyphSpacing = 280;
  const glyphOffset = (engine.distance * 4) % glyphSpacing;
  ctx.fillStyle = inkSubtle;
  ctx.font = '11px monospace';
  for (let gx = -glyphOffset; gx < width + glyphSpacing; gx += glyphSpacing) {
    ctx.fillText('{ code }', gx + 30, groundY - 140);
    ctx.fillText('<dev/>', gx + 160, groundY - 200);
    ctx.fillText('[ 2025 ]', gx + 230, groundY - 100);
  }
  ctx.restore();

  // C. Ground with Ruler Ticks
  ctx.save();
  ctx.fillStyle = isDark ? '#16161E' : '#FFFFFF';
  ctx.fillRect(0, groundY, width, height - groundY);

  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();

  const tickInterval = 24;
  const tickOffset = (engine.distance * 14) % tickInterval;
  ctx.strokeStyle = inkSubtle;
  ctx.lineWidth = 1.5;
  for (let tx = -tickOffset; tx < width + tickInterval; tx += tickInterval) {
    const isMajor = Math.floor((tx + tickOffset + engine.distance * 14) / tickInterval) % 5 === 0;
    const tickH = isMajor ? 12 : 6;
    ctx.beginPath();
    ctx.moveTo(tx, groundY);
    ctx.lineTo(tx, groundY + tickH);
    ctx.stroke();
  }
  ctx.restore();

  // D. Obstacles
  engine.obstacles.forEach((obs) => {
    renderObstacle(ctx, obs, isDark);
  });

  // E. Collectible Project Tokens
  engine.tokens.forEach((token) => {
    renderToken(ctx, token, inkColor, accentColor);
  });

  // F. Particles
  for (let i = engine.particles.length - 1; i >= 0; i--) {
    const pt = engine.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life += 1;
    const progress = pt.life / pt.maxLife;

    if (progress >= 1) {
      engine.particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = (1 - progress) * pt.alpha;
    ctx.fillStyle = pt.color;
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 1;

    if (pt.shape === 'text' && pt.text) {
      ctx.font = `900 ${pt.size}px monospace`;
      ctx.textAlign = 'center';
      // Hard offset shadow for floating near-miss text
      ctx.fillStyle = isDark ? '#000000' : '#161616';
      ctx.fillText(pt.text, pt.x + 2, pt.y + 2);
      ctx.fillStyle = pt.color;
      ctx.fillText(pt.text, pt.x, pt.y);
    } else if (pt.shape === 'spark') {
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.life * 0.2);
      ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
      ctx.strokeRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
    } else {
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    }
    ctx.restore();
  }

  // G. Player
  renderPlayer(ctx, engine, isDark, inkColor, accentColor);
}

interface ProjectDiscoveryGameProps {
  headerSlot?: React.ReactNode;
}

export default function ProjectDiscoveryGame({ headerSlot }: ProjectDiscoveryGameProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('muf.runner.highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });
  const [discoveredSlugs, setDiscoveredSlugs] = useState<string[]>([]);
  const [activeDiscovery, setActiveDiscovery] = useState<ProjectMilestone | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sound.getMuted();
    }
    return false;
  });
  const [countdown, setCountdown] = useState<number | null>(null);

  const engineRef = useRef<EngineState>({
    gameState: 'START',
    distance: 0,
    speed: 5.5,
    baseSpeed: 5.5,
    maxSpeed: 9.5,
    gravity: 0.68,
    jumpVelocity: -12.8,
    isDark: false,
    player: {
      x: 70,
      y: 0,
      width: 44,
      height: 52,
      vy: 0,
      isGrounded: true,
      jumpCount: 0,
      maxJumps: 2,
      runFrame: 0,
      scarfWave: 0,
      landingTimer: 0,
    },
    groundY: 0,
    obstacles: [],
    tokens: [],
    particles: [],
    lastSpawnX: 400,
    discovered: new Set<string>(),
    nextMilestoneIndex: 0,
    lastTime: 0,
  });

  // Particle helper functions declared before use
  const createDustParticles = useCallback((x: number, y: number, count: number) => {
    const isDark = engineRef.current.isDark;
    const color = isDark ? '#C0CAF5' : '#161616';
    for (let i = 0; i < count; i++) {
      engineRef.current.particles.push({
        x: x + (Math.random() * 16 - 8),
        y: y - Math.random() * 4,
        vx: (Math.random() - 0.7) * 3,
        vy: -Math.random() * 2.5 - 0.5,
        size: Math.random() * 4 + 2,
        color,
        alpha: 0.8,
        life: 0,
        maxLife: 20 + Math.random() * 15,
        shape: 'square',
      });
    }
  }, []);

  const createConfetti = useCallback((x: number, y: number, count: number) => {
    const colors = ['#FACC00', '#161616', '#FFFFFF', '#FF5555', '#4ADE80'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      engineRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 45 + Math.random() * 30,
        shape: 'spark',
      });
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = sound.toggleMute();
    setIsMuted(next);
  }, []);

  const spawnNextMilestoneToken = useCallback(() => {
    const engine = engineRef.current;
    if (engine.nextMilestoneIndex < MILESTONES.length) {
      const milestone = MILESTONES[engine.nextMilestoneIndex];
      const canvas = canvasRef.current;
      const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : 900;

      engine.tokens.push({
        id: milestone.slug,
        projectSlug: milestone.slug,
        x: Math.max(width + 200, engine.lastSpawnX + 380),
        y: engine.groundY - 80,
        radius: 24,
        collected: false,
        pulsePhase: 0,
      });
      engine.lastSpawnX = Math.max(width + 200, engine.lastSpawnX + 380);
    }
  }, []);

  const startGame = useCallback(() => {
    const engine = engineRef.current;
    engine.gameState = 'PLAYING';
    engine.distance = 0;
    engine.speed = engine.baseSpeed;
    engine.player.vy = 0;
    engine.player.isGrounded = true;
    engine.player.jumpCount = 0;
    engine.player.landingTimer = 0;
    engine.obstacles = [];
    engine.tokens = [];
    engine.particles = [];
    engine.discovered = new Set<string>();
    engine.nextMilestoneIndex = 0;
    engine.lastSpawnX = 420;

    spawnNextMilestoneToken();

    setGameState('PLAYING');
    setDiscoveredSlugs([]);
    setActiveDiscovery(null);
  }, [spawnNextMilestoneToken]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const triggerDiscovery = useCallback((milestone: ProjectMilestone) => {
    const engine = engineRef.current;
    engine.gameState = 'DISCOVERY';
    engine.discovered.add(milestone.slug);
    engine.nextMilestoneIndex += 1;

    setDiscoveredSlugs(Array.from(engine.discovered));
    setActiveDiscovery(milestone);
    setGameState('DISCOVERY');

    sound.playMilestone();
    createConfetti(engine.player.x + 40, engine.player.y + 20, 36);
  }, [createConfetti]);

  const completeGame = useCallback(() => {
    const engine = engineRef.current;
    engine.gameState = 'COMPLETED';
    setGameState('COMPLETED');
    sound.playVictory();

    const canvas = canvasRef.current;
    const w = canvas ? canvas.width / (window.devicePixelRatio || 1) : 800;
    const h = canvas ? canvas.height / (window.devicePixelRatio || 1) : 500;
    createConfetti(w * 0.3, h * 0.4, 60);
    createConfetti(w * 0.7, h * 0.4, 60);
  }, [createConfetti]);

  const resumeFromDiscovery = useCallback(() => {
    if (activeDiscovery) {
      setActiveDiscovery(null);

      if (engineRef.current.discovered.size >= MILESTONES.length) {
        completeGame();
        return;
      }

      setCountdown(1);
      setTimeout(() => {
        setCountdown(null);
        engineRef.current.gameState = 'PLAYING';
        setGameState('PLAYING');
        spawnNextMilestoneToken();
      }, 700);
    }
  }, [activeDiscovery, completeGame, spawnNextMilestoneToken]);

  const handleGameOver = useCallback(() => {
    const engine = engineRef.current;
    engine.gameState = 'GAME_OVER';
    setGameState('GAME_OVER');
    sound.playHit();

    const currentScore = Math.floor(engine.distance);
    setHighScore((prev) => {
      const nextHigh = Math.max(prev, currentScore);
      localStorage.setItem('muf.runner.highscore', nextHigh.toString());
      return nextHigh;
    });

    createDustParticles(engine.player.x + 20, engine.player.y + 25, 24);
  }, [createDustParticles]);

  const handleJump = useCallback(() => {
    const engine = engineRef.current;
    if (engine.gameState === 'START') {
      startGame();
      return;
    }
    if (engine.gameState === 'GAME_OVER') {
      restartGame();
      return;
    }
    if (engine.gameState === 'COMPLETED') {
      return;
    }
    if (engine.gameState === 'DISCOVERY') {
      resumeFromDiscovery();
      return;
    }

    const p = engine.player;
    if (p.isGrounded || p.jumpCount < p.maxJumps) {
      p.vy = engine.jumpVelocity;
      p.isGrounded = false;
      p.jumpCount += 1;
      sound.playJump();

      createDustParticles(p.x + p.width / 2, engine.groundY, 8);
    }
  }, [createDustParticles, restartGame, resumeFromDiscovery, startGame]);

  // Track dark theme updates
  useEffect(() => {
    const checkDark = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      engineRef.current.isDark = isDark;
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // Update canvas size
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    const groundY = Math.floor(rect.height * 0.76);
    engineRef.current.groundY = groundY;
    if (engineRef.current.player.isGrounded) {
      engineRef.current.player.y = groundY - engineRef.current.player.height;
    }
  }, []);

  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        if (
          engineRef.current.gameState === 'PLAYING' ||
          engineRef.current.gameState === 'START' ||
          engineRef.current.gameState === 'GAME_OVER' ||
          engineRef.current.gameState === 'DISCOVERY'
        ) {
          e.preventDefault();
          handleJump();
        }
      }

      if (e.code === 'KeyM') {
        toggleMute();
      }

      if (e.code === 'Escape' && engineRef.current.gameState === 'DISCOVERY') {
        resumeFromDiscovery();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump, resumeFromDiscovery, toggleMute]);

  // Main 60fps RAF Game Loop
  useEffect(() => {
    let animId: number;

    const loop = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(loop);
        return;
      }

      const engine = engineRef.current;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      if (!engine.lastTime) engine.lastTime = timestamp;
      const dt = Math.min((timestamp - engine.lastTime) / 16.666, 2.0);
      engine.lastTime = timestamp;

      // 1. UPDATE GAME PHYSICS
      if (engine.gameState === 'PLAYING') {
        engine.distance += engine.speed * 0.08 * dt;
        setScore(Math.floor(engine.distance));

        if (engine.speed < engine.maxSpeed) {
          engine.speed += 0.0007 * dt;
        }

        const p = engine.player;
        p.vy += engine.gravity * dt;
        p.y += p.vy * dt;

        const groundSurface = engine.groundY - p.height;
        if (p.y >= groundSurface) {
          p.y = groundSurface;
          p.vy = 0;
          if (!p.isGrounded) {
            p.isGrounded = true;
            p.jumpCount = 0;
            p.landingTimer = 4;
            createDustParticles(p.x + p.width / 2, engine.groundY, 4);
          }
        }

        if (p.landingTimer > 0) {
          p.landingTimer -= 1 * dt;
        }

        if (p.isGrounded) {
          const speedFactor = 1 + (engine.speed - engine.baseSpeed) * 0.04;
          p.runFrame += 0.17 * speedFactor * dt;
        }
        p.scarfWave += 0.18 * dt;

        if (p.isGrounded && Math.random() < 0.25) {
          createDustParticles(p.x, engine.groundY, 1);
        }

        // Milestone token spawning check
        if (engine.nextMilestoneIndex < MILESTONES.length) {
          const nextM = MILESTONES[engine.nextMilestoneIndex];
          const hasActiveToken = engine.tokens.some((t) => t.projectSlug === nextM.slug && !t.collected);

          if (!hasActiveToken && engine.distance >= nextM.tokenSpawnDistance - 50) {
            engine.tokens.push({
              id: nextM.slug,
              projectSlug: nextM.slug,
              x: width + 120,
              y: engine.groundY - 75,
              radius: 22,
              collected: false,
              pulsePhase: 0,
            });
          }
        }

        // Obstacle Spawning (Generous Spacing & 280px Token Buffer Zone)
        const minGap = 350 + engine.speed * 20;
        if (engine.lastSpawnX < width - minGap) {
          // Keep at least 280px buffer zone before and after every Collectible Project Token
          const isNearToken = engine.tokens.some((t) => Math.abs((width + 40) - t.x) < 280);
          const isMilestoneImminent =
            engine.nextMilestoneIndex < MILESTONES.length &&
            Math.abs(engine.distance - MILESTONES[engine.nextMilestoneIndex].tokenSpawnDistance) < 280;

          if (!isNearToken && !isMilestoneImminent) {
            const spawnChance = 0.04;
            if (Math.random() < spawnChance) {
              const types: ObstacleType[] = ['BUG_BLOCK', 'PILLAR_404', 'ERR_BARRIER'];
              const chosenType = types[Math.floor(Math.random() * types.length)];

              let obsW = 40;
              let obsH = 42;
              if (chosenType === 'PILLAR_404') {
                obsW = 36;
                obsH = 68;
              } else if (chosenType === 'ERR_BARRIER') {
                obsW = 64;
                obsH = 36;
              }

              engine.obstacles.push({
                x: width + 40,
                y: engine.groundY - obsH,
                width: obsW,
                height: obsH,
                type: chosenType,
                passed: false,
                nearMissChecked: false,
                animPhase: Math.random() * 10,
              });

              engine.lastSpawnX = width + 40;
            }
          }
        } else {
          engine.lastSpawnX -= engine.speed * dt;
        }

        // Update obstacles
        for (let i = engine.obstacles.length - 1; i >= 0; i--) {
          const obs = engine.obstacles[i];
          obs.x -= engine.speed * dt;
          obs.animPhase = (obs.animPhase || 0) + 0.06 * dt;

          // Forgiving hitboxes: Inset by 7px on all 4 sides
          const playerHitbox = {
            left: p.x + 8,
            right: p.x + p.width - 8,
            top: p.y + 6,
            bottom: p.y + p.height - 2,
          };
          const obsHitbox = {
            left: obs.x + 7,
            right: obs.x + obs.width - 7,
            top: obs.y + 7,
            bottom: obs.y + obs.height - 7,
          };

          const isColliding =
            playerHitbox.right > obsHitbox.left &&
            playerHitbox.left < obsHitbox.right &&
            playerHitbox.bottom > obsHitbox.top &&
            playerHitbox.top < obsHitbox.bottom;

          if (isColliding) {
            handleGameOver();
            break;
          }

          // Near-miss detection: triggers once when player passes the obstacle
          if (!obs.nearMissChecked && playerHitbox.left > obsHitbox.right) {
            obs.nearMissChecked = true;
            const jumpedOverClose =
              playerHitbox.bottom <= obsHitbox.top &&
              obsHitbox.top - playerHitbox.bottom <= 18;

            if (jumpedOverClose) {
              sound.playNearMiss();

              // Floating "+CLOSE CALL" text particle
              engine.particles.push({
                x: p.x + p.width / 2,
                y: p.y - 12,
                vx: 0.2,
                vy: -1.2,
                size: 13,
                color: '#FACC00',
                alpha: 1,
                life: 0,
                maxLife: 45,
                shape: 'text',
                text: '+CLOSE CALL',
              });

              // Yellow spark burst
              for (let s = 0; s < 5; s++) {
                engine.particles.push({
                  x: obsHitbox.right,
                  y: obsHitbox.top,
                  vx: (Math.random() - 0.5) * 3 - 1,
                  vy: (Math.random() - 0.5) * 3 - 1,
                  size: 3 + Math.random() * 3,
                  color: '#FACC00',
                  alpha: 1,
                  life: 0,
                  maxLife: 25,
                  shape: 'spark',
                });
              }
            }
          }

          if (obs.x + obs.width < -60) {
            engine.obstacles.splice(i, 1);
          }
        }

        // Update tokens
        for (let i = engine.tokens.length - 1; i >= 0; i--) {
          const token = engine.tokens[i];
          token.x -= engine.speed * dt;
          token.pulsePhase += 0.08 * dt;

          const tokenCenterX = token.x;
          const tokenCenterY = token.y + Math.sin(token.pulsePhase) * 6;
          const playerCenterX = p.x + p.width / 2;
          const playerCenterY = p.y + p.height / 2;

          const dist = Math.hypot(playerCenterX - tokenCenterX, playerCenterY - tokenCenterY);
          if (dist < token.radius + p.width / 2) {
            token.collected = true;
            sound.playCollect();

            const milestone = MILESTONES.find((m) => m.slug === token.projectSlug);
            engine.tokens.splice(i, 1);

            if (milestone) {
              triggerDiscovery(milestone);
              break;
            }
          }

          if (token.x < -80) {
            engine.tokens.splice(i, 1);
          }
        }
      }

      // 2. RENDER THE GAME WORLD
      renderWorld(ctx, width, height, engine);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [createDustParticles, handleGameOver, triggerDiscovery]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 flex flex-col justify-between overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--canvas-base)',
        color: 'var(--ink)',
        touchAction: gameState === 'PLAYING' ? 'none' : 'auto',
      }}
      onClick={() => {
        if (gameState === 'PLAYING') {
          handleJump();
        }
      }}
      onTouchStart={(e) => {
        if (gameState === 'PLAYING') {
          const target = e.target as HTMLElement;
          if (target && target.closest('button, a, input, [role="button"]')) {
            return;
          }
          e.preventDefault();
          handleJump();
        }
      }}
      tabIndex={0}
      aria-label="Interactive Project Discovery Runner Game"
    >
      {/* Top HUD Bar */}
      <div className="relative z-20 flex items-center justify-between p-2.5 sm:p-5 pointer-events-none gap-1.5 sm:gap-3">
        {/* Monogram / Back pill */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <Link
            href="/#work"
            className="desk-btn px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 min-h-[36px]"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard)',
            }}
            title="Return to standard portfolio"
          >
            <span>←</span>
            <span className="hidden sm:inline">Portfolio</span>
          </Link>

          <span
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DISCOVERY RUNNER</span>
          </span>
        </div>

        {/* Milestone Progress Indicators (3 Tokens) */}
        <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto shrink-0">
          {MILESTONES.map((m, idx) => {
            const isDiscovered = discoveredSlugs.includes(m.slug);
            return (
              <button
                key={m.slug}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDiscovered) {
                    setActiveDiscovery(m);
                    setGameState('DISCOVERY');
                  }
                }}
                title={isDiscovered ? `Discovered: ${m.project.name}` : `Locked Token ${idx + 1}`}
                aria-label={isDiscovered ? `View ${m.project.name} Milestone` : `Token ${idx + 1} Locked`}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all min-h-[36px] ${
                  isDiscovered ? 'cursor-pointer hover:scale-105' : 'opacity-40 cursor-default'
                }`}
                style={{
                  backgroundColor: isDiscovered ? 'var(--accent)' : 'var(--surface)',
                  color: isDiscovered ? 'var(--accent-ink)' : 'var(--ink)',
                  borderColor: 'var(--border)',
                  boxShadow: isDiscovered ? '2px 2px 0 0 var(--border)' : 'none',
                }}
              >
                <span>{isDiscovered ? '✓' : `0${idx + 1}`}</span>
                <span className="hidden md:inline">{m.project.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right HUD: Distance & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto shrink-0">
          {highScore > 0 && (
            <div
              className="hidden lg:flex px-2.5 py-1 rounded-lg font-mono text-xs font-bold items-center gap-1.5 min-h-[36px]"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--ink-subtle)',
              }}
              title="Personal Best Distance"
            >
              <span>BEST:</span>
              <span style={{ color: 'var(--ink)' }}>{highScore}m</span>
            </div>
          )}

          <div
            className="px-2.5 sm:px-3 py-1 rounded-lg font-mono text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2 min-h-[36px]"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard)',
            }}
          >
            <span className="hidden xs:inline" style={{ color: 'var(--ink-subtle)' }}>DIST:</span>
            <span>{score}m</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            aria-label={isMuted ? 'Unmute Sound (M)' : 'Mute Sound (M)'}
            title={isMuted ? 'Unmute Sound (M)' : 'Mute Sound (M)'}
            className="w-8 h-8 sm:w-9 sm:h-9 min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard)',
              color: 'var(--ink)',
            }}
          >
            {isMuted ? (
              <span className="font-mono text-xs font-bold">🔇</span>
            ) : (
              <span className="font-mono text-xs font-bold">🔊</span>
            )}
          </button>

          {headerSlot}
        </div>
      </div>

      {/* Main Game HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer z-10"
        style={{ touchAction: gameState === 'PLAYING' ? 'none' : 'auto' }}
      />

      {/* OVERLAY: START SCREEN */}
      {gameState === 'START' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/25 backdrop-blur-[2px] overflow-y-auto">
          <div
            className="max-w-md w-full p-5 sm:p-8 rounded-2xl text-center flex flex-col items-center gap-3.5 sm:gap-4 transition-all max-h-[88dvh] overflow-y-auto my-auto"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
              }}
            >
              Interactive Discovery Game
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
              Discover My Work
            </h2>

            <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              Run through the graph-paper world, jump over code bugs and merge conflicts, and collect all{' '}
              <strong>3 project tokens</strong> to unveil Vendora, MutiAuction, and CVtoWeb.
            </p>

            <div
              className="w-full p-2.5 sm:p-3 rounded-lg flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono border"
              style={{
                backgroundColor: 'var(--canvas-base)',
                borderColor: 'var(--border)',
                color: 'var(--ink)',
              }}
            >
              <span>[SPACE] / [↑] to Jump</span>
              <span>·</span>
              <span>Tap Screen on Mobile</span>
              <span>·</span>
              <span>Double Jump</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full mt-1">
              <button
                type="button"
                onClick={startGame}
                className="desk-btn w-full py-3 min-h-[44px] rounded-xl text-base font-bold flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-ink)',
                }}
              >
                <span>Start Run</span>
                <span>→</span>
              </button>

              <Link
                href="/work"
                className="desk-btn w-full py-3 min-h-[44px] rounded-xl text-sm font-semibold text-center"
              >
                Skip Game & Browse All Work
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: GAME OVER SCREEN */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/30 backdrop-blur-[2px] overflow-y-auto">
          <div
            className="max-w-md w-full p-5 sm:p-8 rounded-2xl text-center flex flex-col items-center gap-3.5 sm:gap-4 max-h-[88dvh] overflow-y-auto my-auto"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl font-bold font-mono"
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: '2px solid var(--border)',
              }}
            >
              !
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
              Bug Encountered!
            </h2>

            <p className="text-xs sm:text-sm" style={{ color: 'var(--ink-muted)' }}>
              You ran <strong className="font-mono text-sm sm:text-base">{score}m</strong> and discovered{' '}
              <strong className="font-mono text-sm sm:text-base">
                {discoveredSlugs.length} / {MILESTONES.length}
              </strong>{' '}
              project tokens.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full mt-1">
              <button
                type="button"
                onClick={restartGame}
                className="desk-btn w-full py-3 min-h-[44px] rounded-xl text-base font-bold flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-ink)',
                }}
              >
                <span>Try Again (Space)</span>
                <span>↺</span>
              </button>

              <Link
                href="/work"
                className="desk-btn w-full py-3 min-h-[44px] rounded-xl text-sm font-semibold text-center"
              >
                View Static Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: PROJECT DISCOVERY MODAL */}
      {gameState === 'DISCOVERY' && activeDiscovery && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-[3px] overflow-y-auto">
          <div
            className="max-w-xl w-full p-4 sm:p-7 rounded-2xl flex flex-col gap-3.5 text-left transition-transform animate-in fade-in zoom-in-95 duration-200 max-h-[88dvh] overflow-y-auto my-auto"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--canvas-grid)' }}>
              <div className="flex items-center gap-2 font-mono text-xs font-bold">
                <span
                  className="px-2 py-0.5 rounded text-[11px] sm:text-xs"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--accent-ink)',
                  }}
                >
                  PROJECT DISCOVERED · {activeDiscovery.project.index} / 03
                </span>
                <span className="hidden xs:inline" style={{ color: 'var(--ink-subtle)' }}>
                  {activeDiscovery.project.year} · {activeDiscovery.project.type.toUpperCase()}
                </span>
              </div>

              <button
                type="button"
                onClick={resumeFromDiscovery}
                className="text-xs font-mono font-semibold px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                style={{ color: 'var(--ink-subtle)' }}
              >
                [Esc to Close]
              </button>
            </div>

            <div>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight mb-1" style={{ color: 'var(--ink)' }}>
                {activeDiscovery.project.name}
              </h3>
              <p className="text-sm sm:text-lg font-medium" style={{ color: 'var(--ink-muted)' }}>
                {activeDiscovery.project.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--ink)' }}>
              {activeDiscovery.project.lede}
            </p>

            {activeDiscovery.ndaNotice && (
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-mono border"
                style={{
                  backgroundColor: 'var(--canvas-base)',
                  borderColor: 'var(--border)',
                  color: 'var(--ink-subtle)',
                }}
              >
                🔒 {activeDiscovery.ndaNotice}
              </div>
            )}

            <div className="flex flex-col gap-1.5 my-0.5">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--ink-subtle)' }}>
                Verified Key Highlights:
              </span>
              <ul className="flex flex-col gap-1.5 text-xs sm:text-sm">
                {activeDiscovery.keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: 'var(--accent-ink)', fontWeight: 'bold' }}>—</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t" style={{ borderColor: 'var(--canvas-grid)' }}>
              {activeDiscovery.project.chips.map((chip) => (
                <span key={chip} className="desk-chip text-[11px] sm:text-xs font-mono">
                  {chip}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={resumeFromDiscovery}
                className="desk-btn w-full sm:flex-1 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-ink)',
                }}
              >
                <span>Resume Running [Space]</span>
                <span>→</span>
              </button>

              <Link
                href={`/work/${activeDiscovery.project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="desk-btn w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <span>Explore Full Case Study</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: VICTORY / ALL 3 PROJECTS DISCOVERED */}
      {gameState === 'COMPLETED' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-[3px] overflow-y-auto">
          <div
            className="max-w-3xl w-full p-5 sm:p-8 rounded-2xl flex flex-col items-center text-center gap-4 sm:gap-6 my-auto max-h-[90dvh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--surface)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
              }}
            >
              <span>🏆</span>
              <span>All 3 Projects Discovered!</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-5xl font-bold tracking-tight mb-2" style={{ color: 'var(--ink)' }}>
                You&apos;ve Discovered My Work
              </h2>
              <p className="text-xs sm:text-lg max-w-xl mx-auto" style={{ color: 'var(--ink-muted)' }}>
                Awesome run! You successfully completed the discovery run and collected all verified project blueprints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full text-left">
              {MILESTONES.map((m) => (
                <div
                  key={m.slug}
                  className="desk-card p-4 sm:p-5 flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--canvas-base)',
                    border: 'var(--bw) solid var(--border)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 font-mono text-xs font-bold">
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: 'var(--accent-ink)',
                        }}
                      >
                        {m.project.index}
                      </span>
                      <span style={{ color: 'var(--ink-subtle)' }}>{m.project.year}</span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
                      {m.project.name}
                    </h4>

                    <p className="text-xs line-clamp-3 mb-3" style={{ color: 'var(--ink-muted)' }}>
                      {m.project.tagline}
                    </p>
                  </div>

                  <Link
                    href={`/work/${m.project.slug}`}
                    className="desk-btn w-full py-2.5 rounded-lg text-xs font-bold text-center min-h-[38px]"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    Read Case Study →
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={restartGame}
                className="desk-btn w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-ink)',
                }}
              >
                <span>Play Again (Endless Mode)</span>
                <span>↺</span>
              </button>

              <Link
                href="/#work"
                className="desk-btn w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold text-center"
              >
                Return to Portfolio Home →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Countdown Toast */}
      {countdown !== null && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-mono font-bold animate-ping"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-ink)',
              border: 'var(--bw) solid var(--border)',
            }}
          >
            GO!
          </div>
        </div>
      )}

      {/* Bottom Floating Mobile Controls & Hint */}
      <div
        className="relative z-20 flex items-center justify-between p-3 sm:p-4 pointer-events-none"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div
          className="text-xs font-mono font-medium opacity-70 hidden sm:block"
          style={{ color: 'var(--ink)' }}
        >
          [SPACE] / [↑] = Jump · [M] = Mute · [ESC] = Pause
        </div>

        {gameState === 'PLAYING' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleJump();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleJump();
            }}
            aria-label="Tap to Jump"
            className="sm:hidden pointer-events-auto ml-auto px-6 py-3 min-h-[48px] rounded-full text-sm font-mono font-bold uppercase shadow-lg active:scale-95 transition-transform"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-ink)',
              border: 'var(--bw) solid var(--border)',
              boxShadow: 'var(--shadow-hard)',
            }}
          >
            TAP TO JUMP ⇧
          </button>
        )}
      </div>
    </div>
  );
}
