// ۱. انیمیشن کهکشان
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initStars();
  updateSVGScale();
});

let stars = [];
function initStars() {
  stars = [];
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2,
      speed: Math.random() * 0.4 + 0.1,
    });
  }
}

function animateStars() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = Math.random() * width;
    }
  });
  requestAnimationFrame(animateStars);
}
initStars();
animateStars();

// مقیاس‌دهی SVG برای ریسپانسیو (جهت اعمال درست مقادیر در موبایل)
function updateSVGScale() {
  const circles = document.querySelectorAll(".progress-ring__circle");
  const isMobile = window.innerWidth <= 900;
  circles.forEach((circle) => {
    if (isMobile) {
      circle.setAttribute("r", "45");
      circle.setAttribute("cx", "50");
      circle.setAttribute("cy", "50");
      circle.setAttribute("transform", "translate(0, 0)");
    } else {
      circle.setAttribute("r", "35");
      circle.setAttribute("cx", "40");
      circle.setAttribute("cy", "40");
      circle.setAttribute("transform", "translate(0, 0)");
    }
  });
}
updateSVGScale();

// ۲. انیمیشن شمارش رو به بالا
function startCountUp(el) {
  const target = +el.getAttribute("data-target");
  let count = 0;
  const duration = 2000;
  const stepTime = Math.max(Math.floor(duration / target), 15);

  const updateCount = () => {
    if (count < target) {
      count += Math.ceil(target / 100) || 1;
      if (count > target) count = target;
      el.innerText = count;
      setTimeout(updateCount, stepTime);
    } else {
      el.innerText = target;
    }
  };
  updateCount();
}

// ۳. سیستم مدیریت انیمیشن اسکرول (Timeline Items)
const timelineItems = document.querySelectorAll(".timeline-item");
const navLinks = document.querySelectorAll("nav a");

const observerOptions = {
  threshold: 0.25,
  rootMargin: "0px 0px -10% 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // بجای .visible از کلاس اختصاصی is-visible استفاده شده که استایل‌های Tailwind به آن متصل هستند
      entry.target.classList.add("is-visible");

      // فعال کردن شمارشگر
      const counters = entry.target.querySelectorAll(".count-up");
      counters.forEach((c) => {
        if (c.innerText === "0") startCountUp(c);
      });

      // بروزرسانی ناوبری شناور
      const sectionId = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${sectionId}`) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    }
  });
}, observerOptions);

timelineItems.forEach((item) => {
  observer.observe(item);
});

// لایت‌باکس هیرو برای ناوبری
window.addEventListener("scroll", () => {
  if (window.scrollY < 200) {
    navLinks.forEach((l) => l.classList.remove("active"));
    if (navLinks[0]) navLinks[0].classList.add("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("map-modal");
  const openBtn = document.getElementById("open-map-btn");
  const closeBtn = document.getElementById("close-map-btn");

  // باز کردن مودال نمایش عکس
  openBtn.addEventListener("click", () => {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.querySelector(".transform").classList.remove("scale-95");
    modal.querySelector(".transform").classList.add("scale-100");
  });

  // تابع بستن مودال
  const closeModal = () => {
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.querySelector(".transform").classList.remove("scale-100");
    modal.querySelector(".transform").classList.add("scale-95");
  };

  // رویدادهای بستن (کلیک روی ضربدر یا کلیک روی فضای خالی پشت باکس)
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // المان‌های مربوط به پاپ‌آپ نقشه
  const mapModal = document.getElementById("map-modal");
  const openMapBtn = document.getElementById("open-map-btn");
  const closeMapBtn = document.getElementById("close-map-btn");

  // المان‌های مربوط به پاپ‌آپ منابع آموزشی
  const resModal = document.getElementById("resources-modal");
  const openResBtn = document.getElementById("open-resources-btn");
  const closeResBtn = document.getElementById("close-resources-btn");

  // --- مدیریت پاپ‌آپ نقشه ---
  openMapBtn.addEventListener("click", () => {
    mapModal.classList.remove("opacity-0", "pointer-events-none");
    mapModal.querySelector(".transform").classList.remove("scale-95");
    mapModal.querySelector(".transform").classList.add("scale-100");
  });

  const closeMap = () => {
    mapModal.classList.add("opacity-0", "pointer-events-none");
    mapModal.querySelector(".transform").classList.remove("scale-100");
    mapModal.querySelector(".transform").classList.add("scale-95");
  };
  closeMapBtn.addEventListener("click", closeMap);
  mapModal.addEventListener("click", (e) => { if (e.target === mapModal) closeMap(); });


  // --- مدیریت پاپ‌آپ منابع آموزشی ---
  openResBtn.addEventListener("click", () => {
    resModal.classList.remove("opacity-0", "pointer-events-none");
    resModal.querySelector(".transform").classList.remove("scale-95");
    resModal.querySelector(".transform").classList.add("scale-100");
  });

  const closeRes = () => {
    resModal.classList.add("opacity-0", "pointer-events-none");
    resModal.querySelector(".transform").classList.remove("scale-100");
    resModal.querySelector(".transform").classList.add("scale-95");
  };
  closeResBtn.addEventListener("click", closeRes);
  resModal.addEventListener("click", (e) => { if (e.target === resModal) closeRes(); });
});