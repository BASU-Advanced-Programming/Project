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

document.addEventListener("DOMContentLoaded", () => {
  // المان‌های کنترل مودال شخصیت‌ها (گالری تصاویر)
  const charModal = document.getElementById("char-images-modal");
  const openCharBtn = document.getElementById("open-char-images-btn");
  const closeCharBtn = document.getElementById("close-char-images-btn");

  // باز کردن مودال گالری تعاملی
  if (openCharBtn) {
    openCharBtn.addEventListener("click", () => {
      charModal.classList.remove("opacity-0", "pointer-events-none");
      charModal.querySelector(".transform").classList.remove("scale-95");
      charModal.querySelector(".transform").classList.add("scale-100");
    });
  }

  // بسته شدن مودال
  const closeCharModal = () => {
    charModal.classList.add("opacity-0", "pointer-events-none");
    charModal.querySelector(".transform").classList.remove("scale-100");
    charModal.querySelector(".transform").classList.add("scale-95");
  };

  if (closeCharBtn) {
    closeCharBtn.addEventListener("click", closeCharModal);
  }
  if (charModal) {
    charModal.addEventListener("click", (e) => { 
      if (e.target === charModal) closeCharModal(); 
    });
  }
});

// ==============================================
// مدیریت پاپ‌آپ منابع شخصیت‌ها (جدید)
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  // المان‌های مربوط به پاپ‌آپ منابع شخصیت‌ها
  const charResourcesModal = document.getElementById("char-resources-modal");
  const openCharResourcesBtn = document.getElementById("open-char-resources-btn");
  const closeCharResourcesBtn = document.getElementById("close-char-resources-btn");

  // بررسی وجود المان‌ها در صفحه
  if (charResourcesModal && openCharResourcesBtn && closeCharResourcesBtn) {
    // باز کردن پاپ‌آپ منابع شخصیت‌ها
    openCharResourcesBtn.addEventListener("click", () => {
      charResourcesModal.classList.remove("opacity-0", "pointer-events-none");
      const transformDiv = charResourcesModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-95");
        transformDiv.classList.add("scale-100");
      }
    });

    // بستن پاپ‌آپ
    const closeCharResources = () => {
      charResourcesModal.classList.add("opacity-0", "pointer-events-none");
      const transformDiv = charResourcesModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-100");
        transformDiv.classList.add("scale-95");
      }
    };

    closeCharResourcesBtn.addEventListener("click", closeCharResources);
    charResourcesModal.addEventListener("click", (e) => { 
      if (e.target === charResourcesModal) closeCharResources(); 
    });
  }
});
// ==============================================
// مدیریت پاپ‌آپ کارت‌ها (جزئیات و منابع)
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  // مدیریت مودال جزئیات کارت‌ها
  const cardDetailsModal = document.getElementById("card-details-modal");
  const openCardDetailsBtn = document.getElementById("open-card-details-btn");
  const closeCardDetailsBtn = document.getElementById("close-card-details-btn");

  if (cardDetailsModal && openCardDetailsBtn && closeCardDetailsBtn) {
    openCardDetailsBtn.addEventListener("click", () => {
      cardDetailsModal.classList.remove("opacity-0", "pointer-events-none");
      const transformDiv = cardDetailsModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-95");
        transformDiv.classList.add("scale-100");
      }
    });

    const closeCardDetails = () => {
      cardDetailsModal.classList.add("opacity-0", "pointer-events-none");
      const transformDiv = cardDetailsModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-100");
        transformDiv.classList.add("scale-95");
      }
    };

    closeCardDetailsBtn.addEventListener("click", closeCardDetails);
    cardDetailsModal.addEventListener("click", (e) => {
      if (e.target === cardDetailsModal) closeCardDetails();
    });
  }

  // مدیریت مودال منابع کارت‌ها
  const cardResourcesModal = document.getElementById("card-resources-modal");
  const openCardResourcesBtn = document.getElementById("open-card-resources-btn");
  const closeCardResourcesBtn = document.getElementById("close-card-resources-btn");

  if (cardResourcesModal && openCardResourcesBtn && closeCardResourcesBtn) {
    openCardResourcesBtn.addEventListener("click", () => {
      cardResourcesModal.classList.remove("opacity-0", "pointer-events-none");
      const transformDiv = cardResourcesModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-95");
        transformDiv.classList.add("scale-100");
      }
    });

    const closeCardResources = () => {
      cardResourcesModal.classList.add("opacity-0", "pointer-events-none");
      const transformDiv = cardResourcesModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-100");
        transformDiv.classList.add("scale-95");
      }
    };

    closeCardResourcesBtn.addEventListener("click", closeCardResources);
    cardResourcesModal.addEventListener("click", (e) => {
      if (e.target === cardResourcesModal) closeCardResources();
    });
  }
});

// ==============================================
// Combat System with Attack Animation
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const attackBtn = document.getElementById("attack-btn");
  const sherlockCard = document.getElementById("sherlock-card");
  const draculaCard = document.getElementById("dracula-card");
  const attackMessage = document.getElementById("attack-message");
  const bloodCanvas = document.getElementById("blood-effect");
  let ctx = bloodCanvas ? bloodCanvas.getContext("2d") : null;
  
  // Health values - Updated: Dracula 13, Sherlock 16
  let sherlockHealth = 16;
  let draculaHealth = 13;
  let isAttacking = false;

  // Initialize canvas size
  function initBloodCanvas() {
    if (bloodCanvas) {
      bloodCanvas.width = window.innerWidth;
      bloodCanvas.height = window.innerHeight;
    }
  }
  
  window.addEventListener("resize", initBloodCanvas);
  initBloodCanvas();

  // Function to create blood splatter effect
  function createBloodEffect(x, y) {
    if (!ctx || !bloodCanvas) return;
    
    bloodCanvas.classList.remove("hidden");
    ctx.clearRect(0, 0, bloodCanvas.width, bloodCanvas.height);
    
    const bloodDrops = [];
    const dropCount = 30;
    
    for (let i = 0; i < dropCount; i++) {
      bloodDrops.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        size: Math.random() * 8 + 3,
        alpha: 0.8,
        life: 1
      });
    }
    
    function animateBlood() {
      let allDead = true;
      ctx.clearRect(0, 0, bloodCanvas.width, bloodCanvas.height);
      
      for (let i = 0; i < bloodDrops.length; i++) {
        const drop = bloodDrops[i];
        if (drop.life > 0) {
          allDead = false;
          drop.x += drop.vx;
          drop.y += drop.vy;
          drop.vy += 0.5; // gravity
          drop.life -= 0.02;
          drop.alpha = drop.life * 0.8;
          
          ctx.save();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = drop.alpha;
          ctx.fillStyle = `rgba(255, ${Math.random() * 50}, ${Math.random() * 50}, ${drop.alpha})`;
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add smaller splatter
          ctx.fillStyle = `rgba(180, 0, 0, ${drop.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(drop.x - 2, drop.y - 2, drop.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      
      if (!allDead) {
        requestAnimationFrame(animateBlood);
      } else {
        bloodCanvas.classList.add("hidden");
        ctx.clearRect(0, 0, bloodCanvas.width, bloodCanvas.height);
      }
    }
    
    animateBlood();
  }

  // Attack animation function
  async function performAttack() {
    if (isAttacking) return;
    isAttacking = true;
    
    // Get positions for blood effect
    const draculaRect = draculaCard.getBoundingClientRect();
    const bloodX = draculaRect.left + draculaRect.width / 2;
    const bloodY = draculaRect.top + draculaRect.height / 2;
    
    // Show attack message
    attackMessage.classList.remove("hidden");
    
    // Animate Sherlock card (move right)
    sherlockCard.style.transform = "translateX(20px)";
    sherlockCard.style.zIndex = "20";
    
    // Animate Dracula card (shake and flash red)
    draculaCard.style.animation = "shakeEffect 0.5s ease-in-out";
    draculaCard.style.filter = "brightness(1.5) drop-shadow(0 0 20px red)";
    
    // Create blood effect
    createBloodEffect(bloodX, bloodY);
    
    // Reduce Dracula's health (damage between 2-5 for balanced gameplay with low health)
    const damage = Math.floor(Math.random() * 4) + 2; // Random damage between 2-5
    draculaHealth = Math.max(0, draculaHealth - damage);
    
    // Update health bars
    const draculaHealthBar = document.getElementById("dracula-health-bar");
    const draculaHealthValue = document.getElementById("dracula-health-value");
    const draculaHealthPercent = (draculaHealth / 13) * 100;
    draculaHealthBar.style.width = `${draculaHealthPercent}%`;
    draculaHealthValue.textContent = draculaHealth;
    
    // Show damage number
    const damageNumber = document.createElement("div");
    damageNumber.textContent = `-${damage}`;
    damageNumber.style.position = "fixed";
    damageNumber.style.left = `${bloodX}px`;
    damageNumber.style.top = `${bloodY - 30}px`;
    damageNumber.style.color = "#ff3377";
    damageNumber.style.fontSize = "24px";
    damageNumber.style.fontWeight = "bold";
    damageNumber.style.textShadow = "0 0 10px red";
    damageNumber.style.zIndex = "201";
    damageNumber.style.pointerEvents = "none";
    damageNumber.style.animation = "floatUp 1s ease-out forwards";
    document.body.appendChild(damageNumber);
    
    // Wait for animations
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reset animations
    sherlockCard.style.transform = "";
    sherlockCard.style.zIndex = "";
    draculaCard.style.animation = "";
    draculaCard.style.filter = "";
    
    // Hide attack message after delay
    setTimeout(() => {
      attackMessage.classList.add("hidden");
    }, 1000);
    
    // Remove damage number
    setTimeout(() => {
      if (damageNumber && damageNumber.remove) damageNumber.remove();
    }, 1000);
    
    isAttacking = false;
    
    // Check if game over
if (draculaHealth <= 0) {
  setTimeout(() => {
    // Show custom modal
    const modal = document.getElementById("victory-modal");
    modal.classList.remove("opacity-0", "invisible");
    modal.classList.add("opacity-100", "visible");
    
    // Close modal when button clicked
    document.getElementById("close-modal").onclick = () => {
      modal.classList.remove("opacity-100", "visible");
      modal.classList.add("opacity-0", "invisible");
      
      // Reset health
      draculaHealth = 13;
      sherlockHealth = 16;
      document.getElementById("dracula-health-bar").style.width = "100%";
      document.getElementById("dracula-health-value").textContent = "13";
      document.getElementById("sherlock-health-bar").style.width = "100%";
      document.getElementById("sherlock-health-value").textContent = "16";
    };
  }, 500);
}
  }

  // Add click event to attack button
  if (attackBtn) {
    attackBtn.addEventListener("click", performAttack);
  }
});

// Add CSS animations to your stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes shakeEffect {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-50px);
    }
  }
  
  .combat-card {
    transition: transform 0.3s ease, filter 0.3s ease;
  }
  
  .combat-card:hover {
    transform: scale(1.02);
  }
  
  #attack-btn {
    cursor: pointer;
    transition: all 0.2s ease;
    background: none;
    border: none;
    font-size: 3rem;
  }
  
  #attack-btn:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);

// ==============================================
// مدیریت پاپ‌آپ منابع سیستم مبارزه
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  // مدیریت مودال منابع مبارزه
  const combatResourcesModal = document.getElementById("combat-resources-modal");
  const openCombatResourcesBtn = document.getElementById("open-combat-resources-btn");
  const closeCombatResourcesBtn = document.getElementById("close-combat-resources-btn");

  if (combatResourcesModal && openCombatResourcesBtn && closeCombatResourcesBtn) {
    openCombatResourcesBtn.addEventListener("click", () => {
      combatResourcesModal.classList.remove("opacity-0", "pointer-events-none");
      const transformDiv = combatResourcesModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-95");
        transformDiv.classList.add("scale-100");
      }
    });

    const closeCombatResources = () => {
      combatResourcesModal.classList.add("opacity-0", "pointer-events-none");
      const transformDiv = combatResourcesModal.querySelector(".transform");
      if (transformDiv) {
        transformDiv.classList.remove("scale-100");
        transformDiv.classList.add("scale-95");
      }
    };

    closeCombatResourcesBtn.addEventListener("click", closeCombatResources);
    combatResourcesModal.addEventListener("click", (e) => {
      if (e.target === combatResourcesModal) closeCombatResources();
    });
  }
});