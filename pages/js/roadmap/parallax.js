(function (global) {
  function ParallaxController() {
    this.layers = [];
    this.sections = [];
    this.ticking = false;
    this.hero = null;
  }

  ParallaxController.prototype.collect = function () {
    this.layers = Array.from(document.querySelectorAll("[data-parallax-speed]"));
    this.sections = Array.from(document.querySelectorAll(".roadmap-section"));
    this.hero = document.querySelector("[data-parallax-hero]");
  };

  ParallaxController.prototype.apply = function () {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    this.layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.parallaxSpeed) || 0.3;
      const rect = layer.parentElement
        ? layer.parentElement.getBoundingClientRect()
        : { top: 0, height: vh };
      const offset = (rect.top + scrollY - scrollY) * speed * 0.15;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    if (this.hero) {
      const heroLayers = this.hero.querySelectorAll("[data-hero-layer]");
      heroLayers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.heroLayer) || 0.2;
        const y = scrollY * speed;
        layer.style.transform = `translate3d(0, ${y}px, 0) scale(${1 + scrollY * 0.00015})`;
      });
      const opacity = Math.max(0, 1 - scrollY / (vh * 0.85));
      const heroContent = this.hero.querySelector("[data-hero-content]");
      if (heroContent) {
        heroContent.style.opacity = String(opacity);
        heroContent.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`;
      }
    }

    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visible = rect.top < vh * 0.88 && rect.bottom > vh * 0.12;
      if (visible) section.classList.add("section-visible");
    });

    this.ticking = false;
  };

  ParallaxController.prototype.onScroll = function () {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(this.apply.bind(this));
    }
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

  ParallaxController.prototype.init = function () {
    this.collect();
    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) section.classList.add("section-visible");
    });
    this.apply();
    window.addEventListener("scroll", this.onScroll.bind(this), { passive: true });
    window.addEventListener("resize", this.onScroll.bind(this), { passive: true });
    this.bindNav();
  };

  global.RoadmapParallax = ParallaxController;
})(window);
