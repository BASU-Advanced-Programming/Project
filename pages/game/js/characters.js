 // Custom Interactive Game Cursor Module (Desktop Only)
    const cursor = document.querySelector('.game-cursor');
    const cursorDot = document.querySelector('.game-cursor-dot');
    let currentActiveSlideIndex = 0;

    if(window.innerWidth > 1024) {
      document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
      });

      document.querySelectorAll('a, button').forEach(item => {
        item.addEventListener('mouseenter', () => {
          const targetColor = currentActiveSlideIndex === 1 ? '#c5a059' : '#ff003c';
          const targetBg = currentActiveSlideIndex === 1 ? 'rgba(197,160,89,0.05)' : 'rgba(255,0,60,0.05)';
          gsap.to(cursor, { scale: 1.5, borderColor: targetColor, backgroundColor: targetBg, duration: 0.2 });
          gsap.to(cursorDot, { backgroundColor: targetColor, duration: 0.2 });
        });
        item.addEventListener('mouseleave', () => {
          const targetColor = currentActiveSlideIndex === 1 ? '#c5a059' : '#ff003c';
          gsap.to(cursor, { scale: 1, borderColor: targetColor, backgroundColor: "transparent", duration: 0.2 });
          gsap.to(cursorDot, { backgroundColor: targetColor, duration: 0.2 });
        });
      });
    }

    // HTML5 Canvas Ambient Fluid Micro-Particles System (Handles both blood drops and London drizzle rain)
    const canvas = document.getElementById('bloodParticleCanvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        // Dracula uses floating up blood mist, Sherlock uses cinematic falling angled rain
        if (currentActiveSlideIndex === 1) {
          this.y = Math.random() * -canvas.height;
          this.speedY = Math.random() * 5 + 7;
          this.speedX = Math.random() * -1.5 - 0.5; // Angled falling rain
          this.size = Math.random() * 1.5 + 0.5;
          this.opacity = Math.random() * 0.25 + 0.15;
        } else {
          this.y = canvas.height + Math.random() * 100;
          this.speedY = Math.random() * -1.2 - 0.4;
          this.speedX = Math.random() * 0.4 - 0.2;
          this.size = Math.random() * (window.innerWidth > 768 ? 3 : 2) + 1;
          this.opacity = Math.random() * 0.5 + 0.2;
        }
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (currentActiveSlideIndex === 1) {
          if (this.y > canvas.height + 10 || this.x < -10) this.reset();
        } else {
          if (this.y < -10) this.reset();
        }
      }
      draw() {
        if (currentActiveSlideIndex === 1) {
          // Warm bronze/rain color profile for Sherlock
          ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(220, 0, 60, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function initParticles() {
      particlesArray = [];
      const density = window.innerWidth > 768 ? 18000 : 30000;
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / density);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();

    // Ambient Bats Instantiation Engine (Active only during Dracula section)
    function spawnBat() {
      if (currentActiveSlideIndex !== 0) return;
      const bat = document.createElement('div');
      bat.classList.add('bat');
      const startY = Math.random() * (window.innerHeight * 0.5) + (window.innerHeight * 0.1);
      const size = Math.random() * 15 + 12;
      
      bat.style.width = `${size}px`;
      bat.style.height = `${size}px`;
      bat.style.top = `${startY}px`;
      bat.style.left = `-50px`;
      
      document.body.appendChild(bat);

      gsap.to(bat, {
        x: window.innerWidth + 100,
        y: startY + (Math.random() * 160 - 80),
        opacity: Math.random() * 0.4 + 0.2,
        duration: Math.random() * 3 + 4,
        ease: "power1.inOut",
        onComplete: () => bat.remove()
      });
    }
    setInterval(() => {
      if(document.visibilityState === "visible") spawnBat();
    }, 5000);

    // GSAP Immersive Presentation Timeline Array
    function triggerSlideAnimations(slideElement) {
      const charContainer = slideElement.querySelector('.character-container');
      const textGroups = slideElement.querySelectorAll('.hud-entrance-group');
      const fillArcs = slideElement.querySelectorAll('.hud-metric-fill');
      const moon = slideElement.querySelector('.blood-moon');
      const lines = slideElement.querySelectorAll('.mind-line');
      const clues = slideElement.querySelectorAll('.latent-clue');

      const tl = gsap.timeline();

      if (moon) {
        tl.fromTo(moon, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 0.8, duration: 1.6, ease: "power2.out" }, 0);
      }

      // Sherlock-specific layout animation hooks
      if (lines.length > 0) {
        tl.fromTo(lines, { strokeDashoffset: 500, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.4, duration: 2, ease: "power1.out" }, 0);
        tl.fromTo(clues, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" }, 0.5);
      }

      tl.fromTo(charContainer, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 
        0.2
      );

      tl.fromTo(textGroups, 
        { x: window.innerWidth > 1024 ? 30 : 0, y: window.innerWidth > 1024 ? 0 : 20, opacity: 0 }, 
        { x: 0, y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" }, 
        0.4
      );

      // Stat Circular Progress Meter Draw Line
      fillArcs.forEach(arc => {
        const value = arc.getAttribute('data-value');
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (value / 100) * circumference;
        
        gsap.fromTo(arc, 
          { strokeDashoffset: circumference }, 
          { strokeDashoffset: offset, duration: 1.5, ease: "power2.out" }
        );
      });
    }

    // Navigation and Interaction Control Modules
    const viewport = document.getElementById('viewportContainer');
    const sections = document.querySelectorAll('.game-section');
    const navDots = document.querySelectorAll('.hud-nav-dot');
    const navLineTop = document.getElementById('nav-line-top');
    const navLineBottom = document.getElementById('nav-line-bottom');

    function updateActiveNavigationIndicators(index) {
      currentActiveSlideIndex = index;
      
      // Update global cursor skin configurations based on active context
      const accentColor = index === 1 ? '#c5a059' : '#ff003c';
      if(cursor && cursorDot) {
        gsap.to(cursor, {borderColor: accentColor, duration: 0.4});
        gsap.to(cursorDot, {backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}`, duration: 0.4});
      }

      // Update Nav Grid Accent Line Color maps
      if(index === 1) {
        navLineTop.className = "h-16 w-[1px] bg-gradient-to-b from-transparent to-amber-700/40";
        navLineBottom.className = "h-16 w-[1px] bg-gradient-to-t from-transparent to-amber-700/40";
      } else {
        navLineTop.className = "h-16 w-[1px] bg-gradient-to-b from-transparent to-red-900/60";
        navLineBottom.className = "h-16 w-[1px] bg-gradient-to-t from-transparent to-red-900/60";
      }

      navDots.forEach(dot => {
        const dotIndex = parseInt(dot.getAttribute('data-slide'));
        if (dotIndex === index) {
          if (index === 1) {
            dot.className = "hud-nav-dot w-3 h-3 rounded-none rotate-45 border border-amber-600 bg-amber-950/80 transition-all duration-300 scale-125 shadow-[0_0_10px_#c5a059]";
          } else {
            dot.className = "hud-nav-dot w-3 h-3 rounded-none rotate-45 border border-red-700 bg-red-950/80 transition-all duration-300 scale-125 shadow-[0_0_10px_#ff003c]";
          }
        } else {
          dot.className = "hud-nav-dot w-3 h-3 rounded-none rotate-45 border border-zinc-700 bg-zinc-950/80 transition-all duration-300";
        }
      });
    }

    function scrollToSlide(index) {
      if (index < 0 || index >= sections.length) return;
      sections[index].scrollIntoView({ behavior: 'smooth' });
      updateActiveNavigationIndicators(index);
      triggerSlideAnimations(sections[index]);
    }

    const observerOptions = {
      root: viewport,
      threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetIndex = Array.from(sections).indexOf(entry.target);
          updateActiveNavigationIndicators(targetIndex);
          triggerSlideAnimations(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    window.addEventListener('DOMContentLoaded', () => {
      triggerSlideAnimations(sections[0]);
    });