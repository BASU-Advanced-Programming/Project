const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));


const buttons = document.querySelectorAll(".deck-button");
const modal = document.getElementById("cardModal");
const modalImg = document.getElementById("modalImage");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.deck;
    const deck = document.getElementById(id);
    const isOpen = deck.classList.toggle("open");
    if (!isOpen) {
      resetDeck(deck);
      return;
    }

    if (window.innerWidth <= 768) {
      createFanEffect(deck);   // ONLY MOBILE
    }

  });
});

function createFanEffect(deck) {
  const cards = deck.querySelectorAll(".deck-card");
  const total = cards.length;

  deck.classList.add("fan");

  const maxAngle = 80;
  const start = -maxAngle / 2;
  const step = maxAngle / (total - 1)
    ;

  cards.forEach((card, i) => {
    const angle = start + step * i;
    card.style.position = "absolute";
    card.style.left = "50%";
    card.style.transformOrigin = "bottom center";
    card.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  });
}

document.querySelectorAll(".deck-card").forEach(card => {
  card.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = card.src;
  });
});

modal.addEventListener("click", () => {
  modal.style.display = "none";
});


function resetDeck(deck) {
  const cards = deck.querySelectorAll(".deck-card");

  cards.forEach(card => {
    card.style.position = "";
    card.style.left = "";
    card.style.top = "";
    card.style.transform = "";
    card.style.transformOrigin = "";
  });

  deck.classList.remove("fan");
}
window.addEventListener("resize", () => {

  if (window.innerWidth > 768) {

    document.querySelectorAll(".deck-cards").forEach(deck => {
      resetDeck(deck);
    });

  }

});




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

const canvas = document.getElementById("cursor-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let lastMove = Date.now();

let particles = [];

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastMove = Date.now();

  for (let i = 0; i < 4; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

let hoveringClickable = false;
document.addEventListener("mousemove", (e) => {

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastMove = Date.now();

  const style = window.getComputedStyle(e.target);
  hoveringClickable = style.cursor === "pointer";

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

  if (idleTime < 200) {
    return;
  }

  let t = Date.now() * 0.002;

  let circles = [
    { r: 18, speed: 1 },
    { r: 28, speed: -0.7 },
    { r: 40, speed: 0.5 }
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
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
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
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "white";
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}


animate();
// menu
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// step cards
const deckTrigger = document.getElementById('deck-trigger');
const fanCards = document.querySelectorAll('.fan-card');
let isFanOpen = false;

const fanAngles = [-40, -30, -20, -10, 0];
const fanTranslates = [-140, -105, -70, -35, 0];

deckTrigger.addEventListener('click', () => {
  isFanOpen = !isFanOpen;

  fanCards.forEach((card, index) => {
    if (isFanOpen) {
      card.style.transitionDelay = `${index * 50}ms`;
      card.style.transform = `rotate(${fanAngles[index]}deg) translateX(${fanTranslates[index]}px)`;
    } else {
      card.style.transitionDelay = '0ms';
      card.style.transform = `rotate(0deg) translateX(0px)`;
    }
  });

  deckTrigger.style.transform = isFanOpen
    ? 'rotate(10deg) translateX(40px)'
    : 'rotate(0deg) translateX(0px)';
});
// Action info
const actionButtons = document.querySelectorAll(".action-btn");
const display = document.getElementById("action-display");

let activeAction = null;

function getActions(lang) {
  const t = translations[lang];
  return {
    maneuver: `
      <h4 class="text-lg font-semibold mb-2">${t.maneuver_header}</h4>
      <p class="text-slate-400 mb-4">
        <span class="font-bold text-cyan-300">${t.maneuver_first_element_title}</span> ${t.maneuver_first_element_text}
      </p>
      <p class="text-slate-400 mb-6">
        <span class="font-bold text-cyan-300">${t.maneuver_second_element_title}</span> ${t.maneuver_second_element_text}
      </p>
      <div class="relative w-full max-w-[700px] aspect-[7/4.5] mx-auto overflow-hidden rounded-lg shadow-xl border border-slate-700">
        <img src="images/board.jpeg" class="absolute inset-0 w-full h-full object-contain">
        <img id="fighter-token" src="images/sherlockTran.png" class="absolute w-[32px] h-[32px] md:w-[50px] md:h-[50px] object-contain transition-all duration-300 z-20" style="display:none">
        <div id="map-nodes-overlay" class="absolute inset-0 z-10"></div>
      </div>
    `,
    attack: `
  <h3 class="text-xl font-bold mb-3">${t.attack_header}</h3>
  <p class="text-slate-300 mb-6">${t.attack_text}</p>

  <div class="bg-[#161a22] p-5 rounded-[8px] border border-[#222]">
    <h3 class="text-lg font-bold mb-6 text-center">${t.attack_cards_title}</h3>

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
    <h4 class="text-lg font-semibold mb-3">${t.scheme_header}</h4>
    <p class="text-slate-400 mb-6">${t.scheme_text}</p>

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
    const currentActions = getActions(currentLang);

    if (activeAction === action) {
      display.innerHTML = "";
      activeAction = null;
      return;
    }

    display.innerHTML = currentActions[action];
    activeAction = action;

    // Trigger the THUNDER effect if it's a scheme
    if (action === "scheme") {
      triggerThunder();
    }

    if (action === "maneuver") initManeuverMap();
    if (action === "attack") initAttackCards();
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
