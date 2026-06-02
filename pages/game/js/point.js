   const themeBtn = document.getElementById("theme-toggle");
      function updateThemeBtn() {
        themeBtn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
      }
      
      themeBtn.onclick = () => {
        document.documentElement.classList.toggle("dark");
        localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        updateThemeBtn();
      };

      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      updateThemeBtn();

      const canvas = document.getElementById("cursor-canvas");
      const ctx = canvas.getContext("2d");

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      let hoveringClickable = false;
      let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      let lastMove = Date.now();
      let particles = [];

      document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        lastMove = Date.now();

        const style = window.getComputedStyle(e.target);
        hoveringClickable = style.cursor === "pointer" || e.target.tagName.toLowerCase() === "button" || e.target.closest('.bento-card');

        for (let i = 0; i < 4; i++) {
          particles.push(new Particle(mouse.x, mouse.y));
        }
      });

      class Particle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 3 + 1;
          this.speedX = (Math.random() - 0.5) * 2;
          this.speedY = (Math.random() - 0.5) * 2;
          this.life = 80;
          this.hue = Math.random() * 360;
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.life--;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${this.hue},100%,60%,${this.life / 80})`;
          ctx.shadowColor = `hsl(${this.hue},100%,60%)`;
          ctx.shadowBlur = 15;
          ctx.fill();
        }
      }

      function drawIdleCircles() {
        let idleTime = Date.now() - lastMove;
        if (idleTime < 200) return;
        let t = Date.now() * 0.002;
        let circles = [
          { r: 18, speed: 1 },
          { r: 28, speed: -0.7 },
          { r: 40, speed: 0.5 },
        ];
        circles.forEach((c, i) => {
          let angle = t * c.speed;
          let x = mouse.x + Math.cos(angle) * c.r;
          let y = mouse.y + Math.sin(angle) * c.r;

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${(t * 80 + i * 90) % 360},100%,65%)`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = ctx.fillStyle;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
          }
        }

        drawIdleCircles();

        if (hoveringClickable) {
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
          ctx.strokeStyle = document.documentElement.classList.contains("dark") ? "rgba(255,255,255,0.8)" : "rgba(59, 130, 246, 0.7)";
          ctx.lineWidth = 2;
          ctx.shadowBlur = 15;
          ctx.shadowColor = document.documentElement.classList.contains("dark") ? "white" : "#3b82f6";
          ctx.stroke();
        }

        requestAnimationFrame(animate);
      }
      animate();