(() => {
  const canvas = document.getElementById("cursor-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let w = window.innerWidth;
  let h = window.innerHeight;

  canvas.width = w;
  canvas.height = h;

  const mouse = {
    x: w / 2,
    y: h / 2,
    tx: w / 2,
    ty: h / 2
  };

  let lastMove = Date.now();
  const particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.8;

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;

      this.life = 1;
      this.size = 2 + Math.random() * 2;
      this.hue = Math.floor(Math.random() * 360);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.02;
      this.size *= 0.985;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.life, 0);
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 1)`;
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnParticles(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  }

  window.addEventListener("mousemove", (e) => {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
    lastMove = Date.now();
    spawnParticles(e.clientX, e.clientY, 4);
  });

  window.addEventListener("resize", () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  });

  function drawIdleCircles() {
    const idleTime = Date.now() - lastMove;

    // فقط وقتی موس چند لحظه تکان نخورده باشد
    if (idleTime < 200) return;

    const t = Date.now() * 0.002;

    const orbitRadii = [18, 28, 40];
    const colors = [
      "rgba(255, 77, 109, 0.95)",
      "rgba(76, 201, 240, 0.95)",
      "rgba(167, 139, 250, 0.95)"
    ];

    // 3 نقطه رنگی که دور موس می‌چرخند
    for (let i = 0; i < 3; i++) {
      const a = t + i * ((Math.PI * 2) / 3);
      const ox = mouse.x + Math.cos(a) * orbitRadii[i];
      const oy = mouse.y + Math.sin(a) * orbitRadii[i];

      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = colors[i];
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // حلقه توخالی اطراف موس
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawHoverRing() {
    const el = document.elementFromPoint(mouse.x, mouse.y);
    if (!el) return;

    const style = getComputedStyle(el);
    const hoveringClickable =
      style.cursor === "pointer" ||
      el.tagName === "A" ||
      el.tagName === "BUTTON" ||
      el.closest("a, button");

    if (!hoveringClickable) return;

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    mouse.x += (mouse.tx - mouse.x) * 0.2;
    mouse.y += (mouse.ty - mouse.y) * 0.2;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();

      if (p.life <= 0 || p.size <= 0.2) {
        particles.splice(i, 1);
      }
    }

    drawIdleCircles();
    drawHoverRing();

    requestAnimationFrame(animate);
  }

  animate();
})();