/**
 * Neo-Brutalist Pixel Cat Renderer for Project Discovery Runner.
 * 100% code-rendered on HTML5 Canvas using crisp integer fillRect pixel blocks.
 * Zero external image dependencies, zero blurry edges, zero halo artifacts.
 */

export interface CatEnginePlayer {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  isGrounded: boolean;
  jumpCount: number;
  runFrame: number;
  scarfWave: number;
  landingTimer?: number;
}

// 24 columns x 18 rows pixel matrix for each animation state
// Legend:
// '.' = Transparent
// '#' = Body Primary (Light: #161616, Dark: #C0CAF5)
// 'B' = Body Tone (Solid body pixels)
// 'I' = Inner Ear Accent (Pink #F472B6 / Coral #F7768E)
// 'Y' = Golden Yellow Eye (#FACC00)
// 'P' = Pupil Slit
// '-' = Blink Eye Line
// 'S' = Mustard Yellow Scarf (#FACC00 / #E0AF68)
// 'D' = Scarf Shade (#D97706 / #CA8A04)
// '*' = Sparkle / Energy Particle
// '!' = Alert Exclamation Red (#EF4444)

export const CAT_MATRICES = {
  // 1. Idle 0: Alert standing on four paws, tail perked
  idle_0: [
    '........................',
    '..............#...#.....',
    '.............#I#.#I#....',
    '.............###.###....',
    '............#########...',
    '............###YY####...',
    '............###YP#####..',
    '............##########..',
    '.........SSSSSS######...',
    '.......SSSDDDDDSSSS#....',
    '......#BBBBBBBBBBBB#....',
    '...#..#BBBBBBBBBBBB#....',
    '..##.#BBBBBBBBBBBBB#....',
    '.#B#.#BBBBBBBBBBBB#.....',
    '.#B#..#BB##....#BB##....',
    '.#B#..#BB##....#BB##....',
    '..#...#PP##....#PP##....',
    '........................',
  ],

  // 2. Idle 1: Blinking eye, tail swishes gently
  idle_1: [
    '........................',
    '..............#...#.....',
    '.............#I#.#I#....',
    '.............###.###....',
    '............#########...',
    '............####-####...',
    '............##########..',
    '............##########..',
    '.........SSSSSS######...',
    '.......SSSDDDDDSSSS#....',
    '......#BBBBBBBBBBBB#....',
    '....#.#BBBBBBBBBBBB#....',
    '...##.#BBBBBBBBBBBBB#...',
    '..#B#.#BBBBBBBBBBBB#....',
    '..#B#.#BB##....#BB##....',
    '..#B#.#BB##....#BB##....',
    '...#..#PP##....#PP##....',
    '........................',
  ],

  // 3. Run 0: Full Extension Gallop (front paws forward, back paws back)
  run_0: [
    '........................',
    '...............#...#....',
    '..............#I#.#I#...',
    '..............###.###...',
    '.............#########..',
    '.............###YY####..',
    '.............###YP#####.',
    '.............##########.',
    '.....SSSSSSSSSS######...',
    '...SSSSDDDDDDD SSSS#....',
    '..#BBBBBBBBBBBBBBBB#....',
    '.#BBBBBBBBBBBBBBBB#.....',
    '#BB#...#BB#....#BB#.....',
    '#B#...#BB#......#BB#....',
    '#B#..#BB#........#BB#...',
    '....#PP#..........#PP#..',
    '...#PP#............#PP#.',
    '........................',
  ],

  // 4. Run 1: Gather / Passing (paws tucked under body)
  run_1: [
    '........................',
    '..............#...#.....',
    '.............#I#.#I#....',
    '.............###.###....',
    '............#########...',
    '............###YY####...',
    '............###YP#####..',
    '............##########..',
    '....SSSSSSSSSSS######...',
    '..SSSSDDDDDDD SSSS#.....',
    '.#BBBBBBBBBBBBBBBB#.....',
    '#BBBBBBBBBBBBBBBB#......',
    '#B#...#BBBBBBBBBB#......',
    '#B#....#BB##..#BB##.....',
    '#B#....#BB##...#BB##....',
    '........#PP#....#PP#....',
    '........#PP#....#PP#....',
    '........................',
  ],

  // 5. Run 2: Leap / Propulsion (back legs pushing off)
  run_2: [
    '........................',
    '...............#...#....',
    '..............#I#.#I#...',
    '..............###.###...',
    '.............#########..',
    '.............###YY####..',
    '.............###YP#####.',
    '.............##########.',
    '.....SSSSSSSSSS######...',
    '...SSSSDDDDDDD SSSS#....',
    '..#BBBBBBBBBBBBBBBB#....',
    '.#BBBBBBBBBBBBBBBB#.....',
    '#BB#...#BB#.....#BB#....',
    '#B#...#BB#.......#BB#...',
    '#B#..#BB#.........#BB#..',
    '....#PP#...........#PP#.',
    '...#PP#.............#PP#',
    '........................',
  ],

  // 6. Run 3: Front Touchdown (front paws landing on ground)
  run_3: [
    '........................',
    '..............#...#.....',
    '.............#I#.#I#....',
    '.............###.###....',
    '............#########...',
    '............###YY####...',
    '............###YP#####..',
    '............##########..',
    '....SSSSSSSSSSS######...',
    '..SSSSDDDDDDD SSSS#.....',
    '.#BBBBBBBBBBBBBBBB#.....',
    '#BBBBBBBBBBBBBBBB#......',
    '#B#....#BBBBBBBB#.......',
    '#B#...#BB#....#BB#......',
    '#B#..#BB#......#BB#.....',
    '....#PP#........#PP#....',
    '...#PP#..........#PP#...',
    '........................',
  ],

  // 7. Jump / Ascent: Stretched upward leap, ears back
  jump: [
    '........................',
    '...................#....',
    '..................#I#...',
    '.................####...',
    '................#I##....',
    '...............######...',
    '..............###YY###..',
    '.............###YP####..',
    '............##########..',
    '...........SSSS######...',
    '..........SSSDDDSSSS#...',
    '...#.....#BBBBBBBBB#S...',
    '..##....#BBBBBBBBBB#S...',
    '.#B#...#BBBBBBBBBBB#S...',
    '#B#...#BB#.......#BB#...',
    '#B#..#BB#.........#BB#..',
    '....#PP#...........#PP#.',
    '........................',
  ],

  // 8. Fall / Glide: Descending towards landing
  fall: [
    '........................',
    '..............#...#.....',
    '.............#I#.#I#....',
    '.............###.###....',
    '............#########...',
    '............###YY####...',
    '............###YP#####..',
    '............##########..',
    '.........SSSSSS######...',
    '.......SSSDDDDDSSSS#....',
    '......#BBBBBBBBBBBB#....',
    '..#...#BBBBBBBBBBBB#....',
    '.##..#BBBBBBBBBBBBB#....',
    '#B#..#BBBBBBBBBBBB#.....',
    '#B#...#BB##....#BB##....',
    '#B#...#BB##....#BB##....',
    '.......#PP##....#PP##...',
    '........................',
  ],

  // 9. Double Jump: Compact aerial tuck spin
  double_jump: [
    '.........*....*.........',
    '..........*..*..........',
    '......*....##....*......',
    '..........####..........',
    '.........######.........',
    '........###YY###........',
    '.......###YP#####.......',
    '.......##########.......',
    '....*..SSSSSSSSSS..*....',
    '......SSSSDDDDSSSS......',
    '......#BBBBBBBBBB#......',
    '.....#BBBBBBBBBBBB#.....',
    '.....#BBBBBBBBBBBB#.....',
    '......#BBBBBBBBBB#......',
    '......*...####...*......',
    '..........#PP#..........',
    '..........*..*..........',
    '.........*....*.........',
  ],

  // 10. Crash: Startled arched-back cat pose with [!] alert above
  crash: [
    '...........!............',
    '...........!............',
    '........................',
    '..............#...#.....',
    '.............#I#.#I#....',
    '.............###.###....',
    '............#########...',
    '............##YYYY###...',
    '............##YYYY####..',
    '...#........##########..',
    '..###....SSSSSS######...',
    '.#B#B#.SSSDDDDDSSSS#....',
    '#B#.#B#BBBBBBBBBBBB#....',
    '#B#..#BBBBBBBBBBBBB#....',
    '#B#...#BBBBBBBBBBBB#....',
    '.......#BB##...#BB##....',
    '.......#PP##...#PP##....',
    '........................',
  ],
};

export function renderPixelCat(
  ctx: CanvasRenderingContext2D,
  player: CatEnginePlayer,
  groundY: number,
  gameState: string,
  isDark: boolean,
  ink: string,
  accent: string
) {
  // 1. Dynamic Neo-brutalist Ground Contact Shadow
  const distFromGround = Math.max(0, groundY - (player.y + player.height));
  const shadowScale = Math.max(0.3, 1 - distFromGround / 180);
  const shadowAlpha = Math.max(0.06, (1 - distFromGround / 200) * (isDark ? 0.35 : 0.22));

  ctx.save();
  ctx.fillStyle = isDark ? `rgba(0, 0, 0, ${shadowAlpha})` : `rgba(22, 22, 22, ${shadowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(
    player.x + player.width / 2 + 2,
    groundY + 1,
    player.width * 0.72 * shadowScale,
    4.0 * shadowScale,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();

  // 2. Select Active State Matrix
  let matrixKey: keyof typeof CAT_MATRICES = 'run_0';

  if (gameState === 'GAME_OVER') {
    matrixKey = 'crash';
  } else if (gameState === 'START' || gameState === 'DISCOVERY') {
    // Idle blinking every ~3.5 seconds
    const now = Date.now();
    const isBlink = now % 3500 < 180;
    matrixKey = isBlink ? 'idle_1' : 'idle_0';
  } else if (!player.isGrounded) {
    if (player.jumpCount >= 2) {
      matrixKey = 'double_jump';
    } else if (player.vy < 2) {
      matrixKey = 'jump';
    } else {
      matrixKey = 'fall';
    }
  } else if (player.landingTimer && player.landingTimer > 0) {
    matrixKey = 'run_3';
  } else {
    // 4-frame smooth gallop synced to speed
    const runIdx = Math.floor(player.runFrame) % 4;
    matrixKey = `run_${runIdx}` as keyof typeof CAT_MATRICES;
  }

  const matrix = CAT_MATRICES[matrixKey] || CAT_MATRICES.idle_0;

  // 3. Grid Dimensions & Integer Snapping
  // 24 cols x 18 rows. At blockSize = 3: 72px wide, 54px tall.
  const blockSize = 3;
  const gridW = 24 * blockSize; // 72px
  const gridH = 18 * blockSize; // 54px

  // Paws rest on row 16.5 of 18 (y = 16.5 * 3 = 49.5px from top)
  const groundOffset = 49;
  const drawX = Math.round(player.x + player.width / 2 - gridW / 2 + 4);
  const drawY = Math.round(player.y + player.height - groundOffset);

  // 4. Color Palette Mapping
  const colorMap: Record<string, string> = {
    '#': isDark ? '#C0CAF5' : '#161616',
    'B': isDark ? '#A9B1D6' : '#222226',
    'I': isDark ? '#F7768E' : '#F472B6',
    'Y': accent || '#FACC00',
    'P': isDark ? '#1A1B26' : '#161616',
    '-': isDark ? '#C0CAF5' : '#161616',
    'S': accent || (isDark ? '#E0AF68' : '#FACC00'),
    'D': isDark ? '#CA8A04' : '#D97706',
    '*': accent || '#FACC00',
    '!': isDark ? '#F7768E' : '#EF4444',
  };

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // 5. Draw 2D Pixel Matrix directly on Canvas
  for (let r = 0; r < matrix.length; r++) {
    const rowStr = matrix[r];
    for (let c = 0; c < rowStr.length; c++) {
      const ch = rowStr[c];
      const color = colorMap[ch];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(drawX + c * blockSize, drawY + r * blockSize, blockSize, blockSize);
      }
    }
  }

  // 6. Dynamic Flowing Scarf Tail (2-3 trailing ribbon segments)
  if (matrixKey !== 'crash' && matrixKey !== 'double_jump') {
    const scarfColor = colorMap['S'];
    const scarfShadow = colorMap['D'];

    // Scarf neck attachment origin is around col 8, row 8
    const neckX = drawX + 7 * blockSize;
    const neckY = drawY + 8 * blockSize;

    // Flutter phase based on runFrame and scarfWave
    const wave = player.scarfWave || 0;
    const isAir = !player.isGrounded;
    const liftY = isAir ? Math.min(6, -player.vy * 0.4) : 0;

    // Segment 1
    const s1X = neckX - 4;
    const s1Y = neckY + Math.sin(wave) * 2.5 + liftY;
    ctx.fillStyle = scarfColor;
    ctx.fillRect(Math.round(s1X), Math.round(s1Y), blockSize + 1, blockSize + 1);

    // Segment 2
    const s2X = s1X - 4;
    const s2Y = neckY + Math.sin(wave - 0.7) * 4.5 + liftY * 1.2;
    ctx.fillRect(Math.round(s2X), Math.round(s2Y), blockSize + 1, blockSize);

    // Segment 3 (tail tip)
    const s3X = s2X - 4;
    const s3Y = neckY + Math.sin(wave - 1.4) * 6.5 + liftY * 1.4;
    ctx.fillStyle = scarfShadow;
    ctx.fillRect(Math.round(s3X), Math.round(s3Y), blockSize, blockSize);
  }

  // 7. Double Jump Rotating Sparkle Burst Ring
  if (matrixKey === 'double_jump') {
    const ringTime = Date.now() / 120;
    const centerX = drawX + gridW / 2;
    const centerY = drawY + gridH / 2 - 4;
    const radius = 28;

    ctx.fillStyle = colorMap['Y'];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + ringTime;
      const px = Math.round(centerX + Math.cos(angle) * radius);
      const py = Math.round(centerY + Math.sin(angle) * radius);
      ctx.fillRect(px, py, 3, 3);
    }
  }

  // 8. Crash Alert Pixel Exclamation Box [!]
  if (matrixKey === 'crash') {
    const alertX = drawX + 11 * blockSize - 2;
    const alertY = drawY - 14;

    // Small rounded neo-brutalist alert pill
    ctx.fillStyle = colorMap['!'];
    ctx.fillRect(alertX, alertY, 8, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(alertX + 3, alertY + 2, 2, 4);
    ctx.fillRect(alertX + 3, alertY + 7, 2, 2);
  }

  ctx.restore();
}
