document.addEventListener("DOMContentLoaded", () => {
  initBloodRain();
  initSlider();
  initParallax();
  initCustomCursor();
  initDeck();
  initCardModal();
  initThemeToggle();
  initMobileMenu();
  initNavHighlight();
});

/* ── Blood rain particles ── */
function initBloodRain() {
  const container = document.querySelector(".banner-section-main");
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const drop = document.createElement("i");
    drop.className = "blood-rain";
    const left = Math.random() * 100;
    const delay = Math.random() * 18;
    const duration = 5 + Math.random() * 6;
    const opacity = 0.25 + Math.random() * 0.35;

    drop.style.cssText = `
      left: ${left}%;
      animation: blood-fall-${i} ${duration}s ${delay}s infinite;
      opacity: ${opacity};
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes blood-fall-${i} {
        from { top: -${60 + Math.random() * 40}%; opacity: ${opacity}; }
        to { top: 115%; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    container.appendChild(drop);
  }
}

/* ── Slick slider + theme sync ── */
function initSlider() {
  if (typeof jQuery === "undefined" || !jQuery.fn.slick) return;

  const $banner = jQuery(".banner-section-inner");
  const $nav = jQuery(".controller-right-icons-inner");

  $banner.on("init", () => {
    tagSlideThemes();
    applySlideTheme(0);
  });

  $banner.slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: true,
    speed: 500,
    rtl: true,
    asNavFor: ".controller-right-icons-inner",
    touchThreshold: 100,
  });

  $nav.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".banner-section-inner",
    arrows: false,
    dots: false,
    focusOnSelect: true,
    vertical: true,
    verticalSwiping: true,
    infinite: true,
    rtl: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          vertical: false,
          verticalSwiping: false,
          slidesToShow: 3,
        },
      },
    ],
  });

  $banner.on("afterChange", (_e, _slick, currentSlide) => {
    applySlideTheme(currentSlide % 3);
    jQuery(".banner-main-img .main-img").addClass("character-animation");
    setTimeout(() => {
      jQuery(".banner-main-img .main-img").removeClass("character-animation");
    }, 1200);
  });
}

function tagSlideThemes() {
  jQuery(".banner-section-loop").each(function (i) {
    const mod = (i % 3) + 1;
    jQuery(this).addClass(
      mod === 1 ? "banner-loop-one" : mod === 2 ? "banner-loop-second" : "banner-loop-third"
    );
  });
}

function applySlideTheme(index) {
  document.body.classList.remove("theme-slide-1", "theme-slide-2", "theme-slide-3");
  document.body.classList.add(`theme-slide-${(index % 3) + 1}`);
}

/* ── Parallax character images ── */
function initParallax() {
  if (typeof Parallax === "undefined") return;
  document.querySelectorAll(".scene").forEach((el) => new Parallax(el));
}

/* ── GSAP custom cursor ── */
function initCustomCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor || typeof gsap === "undefined") return;

  let mouseX = 0;
  let mouseY = 0;

  gsap.to({}, 0.016, {
    repeat: -1,
    onRepeat() {
      gsap.set(cursor, { left: mouseX, top: mouseY });
    },
  });

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.querySelectorAll(".cursor-scale").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add(el.classList.contains("small") ? "grow-small" : "grow");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("grow", "grow-small");
    });
  });
}

/* ── Deck spread ── */
function initDeck() {
  document.querySelectorAll(".deck-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const deck = document.getElementById(btn.dataset.deck);
      if (!deck) return;

      const cards = deck.querySelectorAll(".deck-card");
      const open = deck.classList.toggle("open");
      const spread = 80;

      cards.forEach((card, i) => {
        const middle = (cards.length - 1) / 2;
        const angle = (i - middle) * (spread / cards.length);
        card.style.transform = open
          ? `translateX(-50%) rotate(${angle}deg) translateY(40px)`
          : `translateX(-50%) rotate(0deg)`;
      });
    });
  });

  document.querySelectorAll(".deck-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = document.getElementById(card.dataset.card);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}

/* ── Card image modal ── */
function initCardModal() {
  const modal = document.getElementById("cardModal");
  const modalImg = document.getElementById("modalImage");
  if (!modal || !modalImg) return;

  document.querySelectorAll(".card-article .card-img").forEach((img) => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.add("open");
    });
  });

  modal.addEventListener("click", () => modal.classList.remove("open"));
}

/* ── Dracula theme toggle easter egg ── */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const draculaWarning = document.getElementById("dracula-warning");
  const draculaBoxInner = document.getElementById("dracula-box-inner");

  if (!themeToggle || !draculaWarning || !draculaBoxInner) return;

  themeToggle.addEventListener("click", () => {
    themeToggle.textContent = "🩸";
    document.body.classList.remove("dracula-rage", "dracula-red");
    draculaBoxInner.classList.remove("dracula-box-shake");
    void document.body.offsetWidth;

    document.body.classList.add("dracula-rage", "dracula-red");
    draculaWarning.classList.add("show");
    draculaBoxInner.classList.add("dracula-box-shake");
    spawnBloodSplash(draculaBoxInner);

    setTimeout(() => {
      draculaWarning.classList.remove("show");
      themeToggle.textContent = "🌙";
    }, 2200);
  });
}

function spawnBloodSplash(originElement) {
  const container = document.getElementById("blood-splatter-container");
  if (!container) return;

  const rect = originElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const count = 18 + Math.floor(Math.random() * 8);

  for (let i = 0; i < count; i++) {
    const drop = document.createElement("div");
    drop.classList.add("blood-drop");
    drop.style.left = centerX + "px";
    drop.style.top = centerY + "px";

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    drop.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    drop.style.setProperty("--dy", Math.sin(angle) * distance + "px");

    container.appendChild(drop);
    setTimeout(() => drop.remove(), 1000);
  }
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });
}

/* ── Active nav on scroll ── */
function initNavHighlight() {
  const sections = ["components", "deck", "cards"];
  const links = document.querySelectorAll(".header-menu a[data-section]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.parentElement.classList.toggle("active", link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}
