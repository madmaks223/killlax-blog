interface RainColumn {
  x: number;
  y: number;
  speed: number;
  length: number;
  seed: number;
}

interface AshParticle {
  x: number;
  y: number;
  vx: number;
  rise: number;
  age: number;
  life: number;
  size: number;
  phase: number;
  drag: number;
  flake: boolean;
}

export function initMatrixFlame(root: HTMLElement) {
  const canvasElement = root.querySelector<HTMLCanvasElement>('[data-flame-canvas]');
  const ashCanvasElement = root.querySelector<HTMLCanvasElement>('[data-ash-canvas]');
  if (!canvasElement || !ashCanvasElement) return;
  const context = canvasElement.getContext('2d')!;
  const ashContext = ashCanvasElement.getContext('2d')!;
  const canvas = canvasElement;
  const ashCanvas = ashCanvasElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const glyphs = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}/*+-=#$%';
  let mode = root.dataset.mode || 'reference';
  let width = 0;
  let height = 0;
  let dpr = 1;
  let fontSize = 16;
  let rainColumns: RainColumn[] = [];
  let lastTime = 0;
  let animationFrame = 0;
  let ashWidth = 0;
  let ashHeight = 0;
  let ashParticles: AshParticle[] = [];
  let ashSeed = crypto.getRandomValues(new Uint32Array(1))[0];
  
  const random = (min: number, max: number) => min + Math.random() * (max - min);
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  // Keep ash randomness independent of the original Matrix animation.
  const ashRandom = (min: number, max: number) => {
    ashSeed = (Math.imul(ashSeed, 1664525) + 1013904223) >>> 0;
    return min + (ashSeed / 4294967296) * (max - min);
  };
  
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = root.clientWidth;
    height = root.clientHeight;
    fontSize = Math.max(13, Math.floor(Math.min(width, height) / 48));
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.fillStyle = '#050505';
    context.fillRect(0, 0, width, height);
    createRain();
    resizeAsh();
    if (reducedMotion.matches) render(1000);
  }
  
  function fireOrigin() {
    const mobile = width <= 640;
    const imageSize = mobile ? Math.min(height * 0.9, 720) : Math.min(width, 920);
    const imageTop = (ashHeight - imageSize) * (mobile ? 0.58 : 0.54);
    return { x: ashWidth * 0.5, y: imageTop + imageSize * 0.68, spread: imageSize * 0.075 };
  }
  
  function createAsh(prewarm = false) {
    const origin = fireOrigin();
    const life = ashRandom(7, 14);
    const age = prewarm ? ashRandom(0, life * 0.85) : 0;
    const rise = ashRandom(28, 62);
    return {
      x: origin.x + ashRandom(-origin.spread, origin.spread) + age * 12,
      y: origin.y + ashRandom(-24, 24) - age * rise,
      vx: ashRandom(-8, 12), rise, age, life,
      size: ashRandom(1, 2.8), phase: ashRandom(0, Math.PI * 2),
      drag: ashRandom(0.6, 1.3), flake: ashRandom(0, 1) > 0.7,
    };
  }
  
  function resizeAsh() {
    ashWidth = root.clientWidth;
    ashHeight = root.clientHeight;
    ashCanvas.width = Math.round(ashWidth * dpr);
    ashCanvas.height = Math.round(ashHeight * dpr);
    ashContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    ashParticles = Array.from({ length: width <= 640 ? 36 : 72 }, () => createAsh(true));
  }
  
  function drawWindAndAsh(time: number, delta: number) {
    ashContext.clearRect(0, 0, ashWidth, ashHeight);
    if (mode !== 'reference') {
      root.style.setProperty('--fire-breath', '1');
      return;
    }
    const seconds = time * 0.001;
    const wind = Math.sin(seconds * 0.65) * 0.72 + Math.sin(seconds * 1.6 + 1.1) * 0.28;
    const breath = reducedMotion.matches ? 1 : 1 + Math.sin(seconds * 1.05) * 0.1 + wind * 0.065 + Math.sin(seconds * 6.8) * 0.015;
    root.style.setProperty('--fire-breath', breath.toFixed(3));
    const step = reducedMotion.matches ? 0 : delta * 0.001;
    ashParticles.forEach((particle, index) => {
      particle.age += step;
      if (particle.age >= particle.life || particle.y < -20 || particle.x < -40 || particle.x > ashWidth + 40) {
        particle = ashParticles[index] = createAsh();
      }
      const progress = particle.age / particle.life;
      const previousX = particle.x;
      const previousY = particle.y;
      const target = wind * 48 * particle.drag + Math.sin(seconds * 1.8 + particle.phase) * 13;
      particle.vx += (target - particle.vx) * (1 - Math.exp(-step * 1.4));
      particle.x += particle.vx * step;
      particle.y -= (particle.rise + Math.sin(seconds * 2 + particle.phase) * 9) * step;
      const fade = clamp(particle.age / 0.4, 0, 1) * Math.pow(1 - progress, 1.3);
      const flicker = 0.76 + Math.sin(seconds * 4.5 + particle.phase) * 0.24;
      const heat = 1 - progress;
      ashContext.save();
      ashContext.globalAlpha = fade * flicker * (particle.flake ? 0.75 : 0.95);
      const color = `rgb(${Math.round(145 + heat * 105)}, ${Math.round(47 + heat * 73)}, ${Math.round(23 + heat * 17)})`;
      if (!particle.flake && step > 0) {
        ashContext.strokeStyle = color;
        ashContext.lineWidth = 0.75;
        ashContext.beginPath();
        ashContext.moveTo(previousX, previousY);
        ashContext.lineTo(particle.x, particle.y);
        ashContext.stroke();
      }
      ashContext.translate(particle.x, particle.y);
      ashContext.rotate(particle.phase + seconds * (particle.flake ? 1.5 : 0.5));
      ashContext.fillStyle = color;
      ashContext.shadowColor = color;
      ashContext.shadowBlur = particle.flake ? 0 : 3;
      const size = particle.size;
      ashContext.beginPath();
      ashContext.moveTo(-size, 0);
      ashContext.lineTo(0, -size * 0.55);
      ashContext.lineTo(size * 0.8, 0);
      ashContext.lineTo(0, size * (particle.flake ? 0.3 : 0.65));
      ashContext.closePath();
      ashContext.fill();
      ashContext.restore();
    });
  }
  
  function createRain() {
    const columns = Math.ceil(width / fontSize);
    rainColumns = Array.from({ length: columns }, (_, index) => ({
      x: index * fontSize + random(-1.5, 1.5),
      y: random(-height * 0.2, height),
      speed: random(54, 124),
      length: Math.floor(random(5, 18)),
      seed: Math.random() * 100,
    }));
  }
  
  function flameShape(y: number, time: number) {
    const sway = Math.sin(time * 0.00065 + y * 8.2) * 0.032;
    const center = 0.5 + sway + Math.sin(y * 14 + time * 0.001) * (0.012 + y * 0.016);
    const baseWidth = Math.pow(clamp(y, 0, 1), 0.58) * 0.35;
    const tongue = Math.sin(y * 24 - time * 0.0014) * 0.055 * (0.25 + y * 0.75);
    return { center, width: Math.max(0.018, 0.038 + baseWidth + tongue) };
  }
  
  function drawBackground() {
    context.fillStyle = mode === 'soulfire' ? 'rgba(4, 3, 3, 0.18)' : 'rgba(5, 5, 5, 0.13)';
    context.fillRect(0, 0, width, height);
    const glow = context.createRadialGradient(width * 0.5, height * 0.82, 0, width * 0.5, height * 0.65, height * 0.78);
    glow.addColorStop(0, mode === 'soulfire' ? 'rgba(141, 35, 15, .095)' : 'rgba(95, 22, 13, .065)');
    glow.addColorStop(0.46, 'rgba(45, 11, 8, .025)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }
  
  function drawFlameGlow(time: number) {
    context.save();
    context.globalCompositeOperation = 'screen';
    const intensity = mode === 'soulfire' ? 0.105 : 0.06;
    for (let index = 0; index < 8; index += 1) {
      const y = 0.14 + index * 0.115;
      const shape = flameShape(y, time);
      const x = shape.center * width;
      const py = height * (0.16 + y * 0.74);
      const radius = Math.max(32, shape.width * width * (0.38 + index * 0.03));
      const haze = context.createRadialGradient(x, py, 0, x, py, radius);
      haze.addColorStop(0, `rgba(179, 45, 21, ${intensity})`);
      haze.addColorStop(0.42, `rgba(112, 27, 16, ${intensity * 0.34})`);
      haze.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = haze;
      context.beginPath();
      context.arc(x, py, radius, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
  
  function drawMatrixRain(time: number, delta: number) {
    context.save();
    context.font = `${fontSize}px "DM Mono", monospace`;
    context.textBaseline = 'top';
    context.globalCompositeOperation = 'lighter';
    rainColumns.forEach((column) => {
      column.y += column.speed * delta * 0.001;
      if (column.y - column.length * fontSize > height * 1.08) {
        column.y = random(-height * 0.25, -fontSize);
        column.speed = random(54, mode === 'soulfire' ? 148 : 124);
        column.length = Math.floor(random(5, mode === 'soulfire' ? 23 : 18));
      }
      for (let trail = 0; trail < column.length; trail += 1) {
        const py = column.y - trail * fontSize;
        const flameY = (py - height * 0.15) / (height * 0.75);
        if (flameY < 0 || flameY > 1) continue;
        const shape = flameShape(flameY, time);
        const normalizedX = (column.x / width - shape.center) / shape.width;
        const inside = clamp(1 - Math.abs(normalizedX), 0, 1);
        if (inside < 0.02) continue;
        const trailFade = 1 - trail / column.length;
        const shimmer = 0.72 + Math.sin(time * 0.003 + column.seed) * 0.28;
        const alpha = clamp(inside * trailFade * shimmer * (mode === 'soulfire' ? 0.92 : 0.72), 0, 1);
        const glyph = glyphs[Math.floor((column.seed + trail + Math.floor(time * 0.003)) % glyphs.length)];
        const isHead = trail === 0 && Math.random() > 0.22;
        context.fillStyle = isHead
          ? `rgba(255, 207, 143, ${alpha})`
          : `rgba(${mode === 'soulfire' ? 217 : 190}, ${mode === 'soulfire' ? 76 : 62}, 40, ${alpha})`;
        context.fillText(glyph, column.x + Math.sin(time * 0.0008 + column.seed) * 2.5, py);
      }
    });
    context.restore();
  }
  
  function render(time: number) {
    const delta = Math.min(time - lastTime || 16, 40);
    lastTime = time;
    drawBackground();
    drawFlameGlow(time);
    drawMatrixRain(time, delta);
    drawWindAndAsh(time, delta);
    if (!reducedMotion.matches && !document.hidden) animationFrame = requestAnimationFrame(render);
  }
  
  root.addEventListener('flame-mode', (event) => {
    const nextMode = (event as CustomEvent<string>).detail;
    if (!['embers', 'soulfire', 'reference'].includes(nextMode)) return;
    mode = nextMode;
    root.dataset.mode = mode;
    context.fillStyle = '#050505';
    context.fillRect(0, 0, width, height);
    resizeAsh();
    drawWindAndAsh(1000, 0);
    if (reducedMotion.matches) render(1000);
  });
  
  reducedMotion.addEventListener('change', () => {
    cancelAnimationFrame(animationFrame);
    lastTime = 0;
    if (reducedMotion.matches) render(1000);
    else if (!document.hidden) animationFrame = requestAnimationFrame(render);
  });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(animationFrame);
    lastTime = 0;
    if (!document.hidden && !reducedMotion.matches) animationFrame = requestAnimationFrame(render);
  });
  const observer = new ResizeObserver(resize);
  observer.observe(root);
  root.dataset.mode = mode;
  resize();
  if (!reducedMotion.matches && !document.hidden) animationFrame = requestAnimationFrame(render);
  
}
