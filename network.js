/** Decorative 3D point graph. No libraries, tracking, or network requests. */
export function createNetwork(canvas) {
  const context = canvas?.getContext('2d');
  if (!context) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const points = Array.from({ length: 92 }, (_, index) => {
    const y = 1 - (index / 91) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
  });
  const edges = [];
  points.forEach((a, i) => points.forEach((b, j) => {
    if (j > i && Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < .49) edges.push([i, j]);
  }));
  let width = 0, height = 0, frame = 0, angle = .45, last = 0, visible = true;
  function draw() {
    context.clearRect(0, 0, width, height);
    const radius = Math.min(width, height) * .38;
    const projected = points.map((point) => {
      const x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
      const z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
      const y = point.y * Math.cos(.32) - z * Math.sin(.32);
      const depth = point.y * Math.sin(.32) + z * Math.cos(.32);
      const scale = 3.6 / (3.6 - depth);
      return { x: width / 2 + x * radius * scale, y: height / 2 + y * radius * scale, depth };
    });
    edges.forEach(([a, b]) => {
      const start = projected[a], end = projected[b];
      const opacity = .09 + ((start.depth + end.depth + 2) / 4) * .33;
      context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(end.x, end.y);
      context.strokeStyle = 'rgba(187,220,162,' + opacity + ')'; context.lineWidth = .7; context.stroke();
    });
    projected.forEach((point, i) => {
      const front = (point.depth + 1) / 2;
      context.beginPath(); context.arc(point.x, point.y, .8 + front * 1.7, 0, Math.PI * 2);
      context.fillStyle = 'rgba(' + (i % 9 === 0 ? '220,249,134' : '188,216,192') + ',' + (.25 + front * .75) + ')';
      context.fill();
      if (i % 23 === 0 && point.depth > .1) {
        context.beginPath(); context.arc(point.x, point.y, 6, 0, Math.PI * 2); context.strokeStyle = '#d8f47855'; context.lineWidth = .6; context.stroke();
      }
    });
  }
  function tick(time) {
    if (time - last > 32) { angle += Math.min(time - (last || time), 60) * .000075; last = time; draw(); }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    draw();
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    draw();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
  window.addEventListener('pageshow', sync);
  resize(); sync();
}
