(function (global) {
  function ParallaxController() {
    this.layers = [];
    this.sectionLayers = [];
    this.contentLayers = [];
    this.sections = [];
    this.globalLayers = [];
    this.running = false;
    this.ticking = false;
    this.hero = null;
    this.mouse = { x: 0, y: 0 };
    this.smoothMouse = { x: 0, y: 0 };
  }

  ParallaxController.prototype.collect = function () {
    this.layers = Array.from(document.querySelectorAll("[data-hero-layer]"));
    this.sectionLayers = Array.from(document.querySelectorAll("[data-section-parallax]"));
    this.contentLayers = Array.from(document.querySelectorAll("[data-parallax-content]"));
    this.globalLayers = Array.from(document.querySelectorAll("[data-global-parallax]"));
    this.sections = Array.from(document.querySelectorAll(".roadmap-section"));
    this.hero = document.querySelector("[data-parallax-hero]");
  };

  ParallaxController.prototype.lerp = function (a, b, t) {
    return a + (b - a) * t;
  };

  ParallaxController.prototype.apply = function () {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    if (this.hero) {
      const heroRect = this.hero.getBoundingClientRect();
      const heroProgress = Math.min(1, Math.max(0, scrollY / (this.hero.offsetHeight * 0.95)));
      const heroContent = this.hero.querySelector("[data-hero-content]");

      this.layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.heroLayer) || 0.4;
        const depth = parseFloat(layer.dataset.heroDepth) || 1;
        const axis = layer.dataset.heroAxis || "y";
        const y = scrollY * speed;
        const x = this.smoothMouse.x * depth * 32;
        const mouseY = this.smoothMouse.y * depth * 22;
        const scale = 1 + scrollY * 0.0005 + depth * 0.06;
        const rotate = this.smoothMouse.x * depth * 2.5;

        if (axis === "xy") {
          layer.style.transform = `translate3d(${x}px, ${y + mouseY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
        } else {
          layer.style.transform = `translate3d(${x * 0.4}px, ${y + mouseY}px, 0) scale(${scale})`;
        }
      });

      if (heroContent) {
        const contentY = scrollY * 0.92;
        const contentScale = 1 - heroProgress * 0.08;
        heroContent.style.opacity = String(Math.max(0, 1 - heroProgress * 1.15));
        heroContent.style.transform = `translate3d(${this.smoothMouse.x * 14}px, ${contentY}px, 0) scale(${contentScale})`;
        heroContent.style.filter = `blur(${heroProgress * 4}px)`;
      }

      this.hero.style.setProperty("--hero-progress", String(heroProgress));
    }

    this.sectionLayers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.sectionParallax) || 0.35;
      const section = layer.closest(".roadmap-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(1.2, Math.max(-0.2, progress));
      const y = (clamped - 0.5) * speed * 320;
      const x = (clamped - 0.5) * speed * 120;
      const scale = 1 + Math.abs(clamped - 0.5) * 0.15;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    });

    this.globalLayers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.globalParallax) || 0.15;
      const y = scrollY * speed;
      const x = this.smoothMouse.x * speed * 55;
      const mouseY = this.smoothMouse.y * speed * 35;
      layer.style.transform = `translate3d(${x}px, ${y + mouseY}px, 0)`;
    });

    this.contentLayers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.parallaxContent) || 0.1;
      const section = layer.closest(".roadmap-section");
      const rect = section ? section.getBoundingClientRect() : layer.getBoundingClientRect();
      const progress = (vh - rect.top) / (vh + rect.height * 0.5);
      const clamped = Math.min(1, Math.max(0, progress));
      const y = (0.5 - clamped) * speed * 220;
      layer.style.transform = `translate3d(0, ${y}px, 0)`;
    });

    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < vh * 0.88 && rect.bottom > vh * 0.12) {
        section.classList.add("section-visible");
      }
    });

    this.ticking = false;
  };

  ParallaxController.prototype.onScroll = function () {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(this.apply.bind(this));
    }
  };

  ParallaxController.prototype.onMouseMove = function (e) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    this.mouse.x = (e.clientX - cx) / cx;
    this.mouse.y = (e.clientY - cy) / cy;
    this.onScroll();
  };

  ParallaxController.prototype.bindNav = function () {
    const steps = document.querySelectorAll(".roadmap-nav-step");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          steps.forEach((step) => {
            const num = step.querySelector("span");
            const active = step.dataset.nav === id;
            step.classList.toggle("nav-active", active);
            if (num) {
              num.classList.toggle("bg-indigo-500", active);
              num.classList.toggle("text-white", active);
              num.classList.toggle("bg-[#222]", !active);
              num.classList.toggle("text-slate-400", !active);
            }
          });
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );
    this.sections.forEach((section) => observer.observe(section));
  };

  ParallaxController.prototype.loop = function () {
    this.smoothMouse.x = this.lerp(this.smoothMouse.x, this.mouse.x, 0.06);
    this.smoothMouse.y = this.lerp(this.smoothMouse.y, this.mouse.y, 0.06);
    this.apply();
    requestAnimationFrame(this.loop.bind(this));
  };

  ParallaxController.prototype.init = function () {
    this.collect();
    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) section.classList.add("section-visible");
    });
    this.apply();
    window.addEventListener("scroll", this.onScroll.bind(this), { passive: true });
    window.addEventListener("resize", this.onScroll.bind(this), { passive: true });
    window.addEventListener("mousemove", this.onMouseMove.bind(this), { passive: true });
    this.bindNav();
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.loop.bind(this));
    }
  };

  global.RoadmapParallax = ParallaxController;
})(window);
