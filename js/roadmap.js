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

const openHowTo = document.getElementById("open-howto-btn");
const closeHowTo = document.getElementById("close-howto-btn");
const howToModal = document.getElementById("howto-modal");

openHowTo?.addEventListener("click", () => {
  howToModal.classList.remove("opacity-0", "pointer-events-none");
});

closeHowTo?.addEventListener("click", () => {
  howToModal.classList.add("opacity-0", "pointer-events-none");
});
// Action info
const actionButtons = document.querySelectorAll(".action-btn");
const display = document.getElementById("action-display");

let activeAction = null;

function getActions() {

  return {

    maneuver: `
  <h4 class="text-lg font-semibold mb-2">مانور</h4>

  <p class="text-slate-400 mb-4">
    <span class="font-bold text-cyan-300">
      ۱. یک کارت بکش:
    </span>
    باید بالاترین کارت دسته کارت خود را برداری.
  </p>

  <p class="text-slate-400 mb-6">
    <span class="font-bold text-cyan-300">
      ۲. مبارز خود را حرکت بده:
    </span>
    می‌توانی هر مبارز را تا مقدار حرکت مجاز او جابه‌جا کنی.
  </p>

  <div class="relative w-full max-w-[700px] aspect-[7/4.5] mx-auto overflow-hidden rounded-lg shadow-xl border border-slate-700">
    <img src="images/board.jpeg" class="absolute inset-0 w-full h-full object-contain">
    <img id="fighter-token" src="images/sherlockTran.png"
      class="absolute w-[32px] h-[32px] md:w-[50px] md:h-[50px] object-contain transition-all duration-300 z-20"
      style="display:none">
    <div id="map-nodes-overlay" class="absolute inset-0 z-10"></div>
  </div>
`,

attack: `
  <h3 class="text-xl font-bold mb-3">حمله</h3>
  <p class="text-slate-300 mb-6">
    مبارزی از حریف که در محدوده حمله شما قرار دارد را انتخاب کنید و یک کارت حمله بازی کنید. سپس حریف می‌تواند یک کارت دفاع بازی کند.
  </p>

  <div class="bg-[#161a22] p-5 rounded-[8px] border border-[#222]">
    <h3 class="text-lg font-bold mb-6 text-center">
      کارت‌های مبارزه
    </h3>

    <div class="flex justify-center gap-20 flex-wrap">

      <!-- ATTACK COLUMN -->
      <div id="attack-card" class="flex flex-col items-center gap-6">

        <div class="attack-box w-[220px] h-[320px] rounded-[14px] overflow-hidden cursor-pointer relative transition bg-[#111] z-10 hover:scale-[1.05] hover:shadow-[0_0_20px_6px_rgba(200,0,0,0.7)] hover:border-[darkred] border-2 border-transparent">
          <img src="images/dracula/beastform.png" class="attack-img w-full h-full object-cover"/>
        </div>

      </div>

      <!-- DEFENSE COLUMN -->
      <div id="defense-card" class="flex flex-col items-center gap-6">

        <div class="defense-box w-[220px] h-[320px] rounded-[14px] overflow-hidden cursor-pointer transition relative">
          <img src="images/dracula/look-into-my-eyes.png" class="defense-img w-full h-full object-cover"/>
        </div>

      </div>

    </div>
  </div>
`,

scheme: `
  <div id="scheme-container" class="relative text-center">
    <h4 class="text-lg font-semibold mb-3">رویداد</h4>

    <p class="text-slate-400 mb-6">
      یک کارت رویداد بازی کنید و اثر آن را در بازی اعمال کنید.
    </p>

    <div class="flex justify-center">
      <div id="scheme-card" class="relative w-[240px] h-[340px] rounded-[14px] transition-all duration-300">

        <div id="scheme-glow"
             class="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-150
                    shadow-[0_0_25px_8px_rgba(255,215,0,0.8)] border-4 border-yellow-400">
        </div>

        <img src="images/holms/administer-aid.png"
             class="relative z-10 w-full h-full object-cover rounded-[14px]">
      </div>
    </div>
  </div>
`,

  };
}
actionButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    const action = btn.dataset.action;

    const currentActions = getActions();

    if (activeAction === action) {
      display.innerHTML = "";
      activeAction = null;
      return;
    }

    display.innerHTML = currentActions[action];
    activeAction = action;

    if (action === "scheme") {
      triggerThunder();
    }

    if (action === "maneuver") {
      initManeuverMap();
    }

    if (action === "attack") {
      initAttackCards();
    }
  });
});

function triggerThunder() {
  const container = document.getElementById("scheme-container");
  const glow = document.getElementById("scheme-glow");
  const card = document.getElementById("scheme-card");

  if (!container || !glow || !card) return;

  // 1. Trigger shake
  container.classList.add("shake-it");

  // 2. High-saturation glow
  glow.style.opacity = "1";

  // 3. Subtle scale pop
  card.style.transform = "scale(1.03)";

  setTimeout(() => {
    // Reset after impact
    glow.style.opacity = "0";
    card.style.transform = "scale(1)";
    container.classList.remove("shake-it");
  }, 300); // Short, punchy duration
}


function initManeuverMap() {

  const mapNodes = [
    { id: 1, x: 6, y: 31, links: [2, 3, 4] },
    { id: 2, x: 18, y: 33, links: [1, 3] },
    { id: 3, x: 8, y: 14, links: [1, 2] },
    { id: 4, x: 10, y: 58, links: [1] },
  ];

  const MOVE_VALUE = 1;

  const overlay = document.getElementById("map-nodes-overlay");
  const fighter = document.getElementById("fighter-token");

  if (!overlay || !fighter) return;

  overlay.innerHTML = "";

  let currentNode = 1;
  const isMobile = window.innerWidth < 768;

  const NODE_SIZE = isMobile ? 10 : 50;

  mapNodes.forEach(node => {

    const el = document.createElement("div");

    el.className = "node-point";

    el.style.position = "absolute";
    el.style.width = `${NODE_SIZE}px`;
    el.style.height = `${NODE_SIZE}px`;

    el.style.borderRadius = "50%";
    el.style.background = "rgba(255,255,255,0.15)";
    el.style.border = "2px solid rgba(255,255,255,0.3)";
    el.style.cursor = "pointer";
    el.style.transition = "all 0.25s ease";

    el.style.left = `calc(${node.x}% - ${NODE_SIZE / 2}px)`;
    el.style.top = `calc(${node.y}% - ${NODE_SIZE / 2}px)`;


    el.dataset.id = node.id;

    overlay.appendChild(el);

  });

  function placeFighter(nodeId) {

    const node = mapNodes.find(n => n.id == nodeId);

    fighter.style.display = "block";
    const FIGHTER_SIZE = isMobile ? 32 : 50;

    fighter.style.left = `calc(${node.x}% - ${FIGHTER_SIZE / 2}px)`;
    fighter.style.top = `calc(${node.y}% - ${FIGHTER_SIZE / 2}px)`;


    currentNode = nodeId;
  }
  function getReachable(start, steps) {

    let queue = [{ id: start, dist: 0 }];
    let reachable = new Set();

    while (queue.length) {

      const { id, dist } = queue.shift();

      if (dist === steps) continue;

      const node = mapNodes.find(n => n.id === id);

      node.links.forEach(link => {

        if (!reachable.has(link) && link !== start) {

          reachable.add(link);
          queue.push({ id: link, dist: dist + 1 });

        }

      });

    }

    return [...reachable];
  }

  function highlightNodes(nodes) {

    document.querySelectorAll(".node-point").forEach(point => {

      point.style.boxShadow = "";
      point.style.transform = "";
      point.style.background = "rgba(255,255,255,0.15)";

    });

    nodes.forEach(id => {

      const el = document.querySelector(`.node-point[data-id="${id}"]`);

      if (!el) return;

      el.style.boxShadow = "0 0 12px 6px rgba(0,255,180,0.9)";
      el.style.background = "rgba(0,255,180,0.4)";
      el.style.transform = "scale(1.2)";

    });
  }

  function enableMovement() {

    const reachable = getReachable(currentNode, MOVE_VALUE);

    highlightNodes(reachable);

    document.querySelectorAll(".node-point").forEach(point => {

      point.onclick = () => {

        const id = parseInt(point.dataset.id);

        if (reachable.includes(id)) {

          placeFighter(id);

          enableMovement();

        }

      };

    });
  }

  placeFighter(currentNode);

  enableMovement();
}

function drawLightning(container) {
  const rect = container.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "100";
  canvas.width = rect.width;
  canvas.height = rect.height;
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // Lightning Drawing Logic
  let x = Math.random() * rect.width;
  let y = 0;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "yellow";
  ctx.beginPath();
  ctx.moveTo(x, y);

  while (y < rect.height) {
    x += (Math.random() - 0.5) * 40;
    y += Math.random() * 20;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Remove the canvas after the flash
  setTimeout(() => canvas.remove(), 200);
}


document.querySelectorAll(".hero-box").forEach(hero => {

  const img = hero.querySelector(".hero-img");

  const front = img.src;
  const card = hero.dataset.card;

  let flipped = false;

  hero.addEventListener("click", () => {


    if (hero.classList.contains("hero-invisible")) {
      createFogEffect(hero);
    }

    if (hero.classList.contains("hero-dracula")) {
      bloodSplash(hero);
    }

    if (hero.classList.contains("hero-sherlock")) {
      sherlockStorm(hero);
    }

    setTimeout(() => {
      img.src = flipped ? front : card;
      flipped = !flipped;
    }, 300);

  });

});


const nodes = [
  { x: "8%", y: "12%" },
  { x: "39%", y: "11%" },
  { x: "69%", y: "55%" },
  { x: "51%", y: "25%" },
  { x: "46%", y: "55%" },
  { x: "92%", y: "55%" },
];

const fighters = [
  document.getElementById("fighter1"),
  document.getElementById("fighter2"),
  document.getElementById("fighter3")
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function moveFighters() {
  const shuffledNodes = [...nodes];
  shuffle(shuffledNodes);

  fighters.forEach((fighter, index) => {
    if (!fighter) return;
    fighter.style.left = shuffledNodes[index].x;
    fighter.style.top = shuffledNodes[index].y;
  });
}


setInterval(moveFighters, 2000);
moveFighters();




function createFogEffect(hero) {
  const canvas = hero.querySelector(".fx-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  renderer.setSize(hero.offsetWidth, hero.offsetHeight);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      time: { value: 0 },
      opacity: { value: 1.0 }
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform float time;
            uniform float opacity;
            varying vec2 vUv;
            void main() {
                float n = sin(vUv.x * 8.0 + time) * cos(vUv.y * 5.0 + time * 0.5);
                float fog = smoothstep(-1.0, 1.0, n);
                gl_FragColor = vec4(0.9, 0.9, 1.0, fog * 0.7 * opacity);
            }
        `
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let startTime = Date.now();
  let animationId;

  function animate() {
    let elapsed = (Date.now() - startTime) / 1000;

    if (elapsed > 2.5) {
      renderer.clear();
      cancelAnimationFrame(animationId);
      return;
    }

    if (elapsed > 1.5) {
      material.uniforms.opacity.value = 2.5 - elapsed;
    }

    material.uniforms.time.value = elapsed * 1.5;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }

  animate();
}




function bloodSplash(hero) {

  const canvas = hero.querySelector(".fx-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;

  let particles = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      radius: Math.random() * 6 + 2,
      life: 100
    });
  }

  function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {

      p.vy += 0.2;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139,0,0,0.9)";
      ctx.fill();

    });

    particles = particles.filter(p => p.life > 0);

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    }

  }

  animate();

}



function initAttackCards() {

  const attackCards = document.querySelectorAll(".attack-box");
  const defenseCards = document.querySelectorAll(".defense-box");

  defenseCards.forEach(def => {

    if (def.querySelector(".blood-effect")) return;

    const blood = document.createElement("div");

    blood.className = "blood-effect";

    def.appendChild(blood);
  });

  attackCards.forEach((attack, index) => {

    attack.addEventListener("click", async () => {

      const defense = defenseCards[index];

      if (!defense) return;

      if (attack.dataset.busy === "1") return;

      attack.dataset.busy = "1";

      const attackRect = attack.getBoundingClientRect();
      const defenseRect = defense.getBoundingClientRect();

      const moveX =
        defenseRect.left + defenseRect.width / 2 -
        (attackRect.left + attackRect.width / 2);

      const moveY =
        defenseRect.top + defenseRect.height / 2 -
        (attackRect.top + attackRect.height / 2);

      await attack.animate(
        [
          { transform: "translate(0,0) scale(1)" },
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` }
        ],
        {
          duration: 380,
          easing: "cubic-bezier(.2,.9,.2,1)",
          fill: "forwards"
        }
      ).finished;

      const shake = attack.animate(
        [
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX - 10}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX + 10}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` }
        ],
        {
          duration: 260,
          easing: "ease-in-out",
          fill: "forwards"
        }
      );

      const blood = defense.querySelector(".blood-effect");

      if (blood) {

        blood.animate(
          [
            { opacity: 0, transform: "scale(0.85)" },
            { opacity: 1, transform: "scale(1.05)" },
            { opacity: 0.75, transform: "scale(1.0)" }
          ],
          {
            duration: 220,
            easing: "cubic-bezier(.2,.9,.2,1)",
            fill: "forwards"
          }
        );

        setTimeout(() => {

          blood.animate(
            [{ opacity: 0.75 }, { opacity: 0 }],
            {
              duration: 600,
              easing: "ease-out",
              fill: "forwards"
            }
          );

        }, 1200);
      }

      await shake.finished;

      await attack.animate(
        [
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` },
          { transform: "translate(0,0) scale(1)" }
        ],
        {
          duration: 420,
          easing: "cubic-bezier(.2,.9,.2,1)",
          fill: "forwards"
        }
      ).finished;

      attack.style.transform = "";

      attack.dataset.busy = "0";
    });
  });
}


function sherlockStorm(hero) {
  const canvas = hero.querySelector(".fx-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;

  const symbols = ["Σ", "Δ", "π", "√", "x", "y", "∞", "β", "λ", "∫"];
  let particles = [];

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vy: Math.random() * 2 + 2,
      fontSize: Math.floor(Math.random() * 10) + 12,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      opacity: 1
    });
  }

  let startTime = Date.now();
  let animationId;

  function animate() {
    let elapsed = Date.now() - startTime;

    if (elapsed > 2500) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationId);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let fadeOut = elapsed > 1500 ? (2500 - elapsed) / 1000 : 1;

    particles.forEach(p => {
      ctx.fillStyle = `rgb(69, 71, 42), ${fadeOut})`;
      ctx.font = `${p.fontSize}px serif`;
      ctx.fillText(p.symbol, p.x, p.y);

      p.y += p.vy;
      if (p.y > canvas.height) p.y = -20;
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();
}