
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("in-view");
    }
  });
},{ threshold: 0.15 });

reveals.forEach(el=>observer.observe(el));

/* ================= DECK ================= */

const buttons = document.querySelectorAll(".deck-button");
const modal = document.getElementById("cardModal");
const modalImg = document.getElementById("modalImage");

buttons.forEach(btn=>{
btn.addEventListener("click",()=>{
const id = btn.dataset.deck;
const deck = document.getElementById(id);
const isOpen = deck.classList.toggle("open");
   if (!isOpen) {
      resetDeck(deck);
      return;
    }

   if (window.innerWidth <= 1580) {
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
  const step = maxAngle / (total - 1);

  cards.forEach((card, i) => {
    const angle = start + step * i;
    card.style.position = "absolute";
    card.style.left = "50%";
    card.style.transformOrigin = "bottom center";
    card.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  });
}

document.querySelectorAll(".deck-card").forEach(card=>{
card.addEventListener("click",()=>{
modal.style.display="flex";
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



/* ================= HERO SELECTION ================= */

document.querySelectorAll(".hero-box").forEach(hero=>{

const img = hero.querySelector(".hero-img");

const front = img.src;
const card = hero.dataset.card;

let flipped = false;

hero.addEventListener("click",()=>{


if(hero.classList.contains("hero-invisible")){
createFogEffect(hero);
}

if(hero.classList.contains("hero-dracula")){
bloodSplash(hero);
}

if(hero.classList.contains("hero-sherlock")){
sherlockStorm(hero);
}

setTimeout(()=>{
img.src = flipped ? front : card;
flipped = !flipped;
},300);

});

});



/* ================= BOARD MOVEMENT ================= */

const nodes = [
  { x: "8%",   y: "12%" },
  { x: "39%",  y: "11%" },
  { x: "69%",  y: "55%" },
  { x: "51%",  y: "25%" },
  { x: "46%",  y: "55%" },
  { x: "92%",  y: "55%" },
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
    fighter.style.top  = shuffledNodes[index].y;
  });
}


setInterval(moveFighters, 2000);
moveFighters();



/* ================= INVISIBLE MAN FOG ================= */

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



/* ================= DRACULA BLOOD ================= */

function bloodSplash(hero){

const canvas = hero.querySelector(".fx-canvas");
const ctx = canvas.getContext("2d");

canvas.width = hero.offsetWidth;
canvas.height = hero.offsetHeight;

let particles = [];

for(let i=0;i<80;i++){
particles.push({
x:canvas.width/2,
y:canvas.height/2,
vx:(Math.random()-0.5)*8,
vy:(Math.random()-0.5)*8,
radius:Math.random()*6+2,
life:100
});
}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{

p.vy += 0.2;
p.x += p.vx;
p.y += p.vy;
p.life--;

ctx.beginPath();
ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
ctx.fillStyle="rgba(139,0,0,0.9)";
ctx.fill();

});

particles = particles.filter(p=>p.life>0);

if(particles.length>0){
requestAnimationFrame(animate);
}

}

animate();

}


/* ================= Attack EFFECT ================= */

document.addEventListener("DOMContentLoaded", () => {
  const attackCards = document.querySelectorAll(".attack-box");
  const defenseCards = document.querySelectorAll(".defense-box");

  defenseCards.forEach(def => {
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
        defenseRect.left + defenseRect.width / 2 - (attackRect.left + attackRect.width / 2);
      const moveY =
        defenseRect.top + defenseRect.height / 2 - (attackRect.top + attackRect.height / 2);

      await attack.animate(
        [
          { transform: "translate(0,0) scale(1)" },
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` }
        ],
        { duration: 380, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      ).finished;

      const shake = attack.animate(
        [
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX - 10}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX + 10}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX - 8}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX + 8}px, ${moveY}px) scale(1.08)` },
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` }
        ],
        { duration: 260, easing: "ease-in-out", iterations: 1, fill: "forwards" }
      );

      const blood = defense.querySelector(".blood-effect");
      if (blood) {
        blood.animate(
          [
            { opacity: 0, transform: "scale(0.85)" },
            { opacity: 1, transform: "scale(1.05)" },
            { opacity: 0.75, transform: "scale(1.0)" }
          ],
          { duration: 220, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
        );

        setTimeout(() => {
          blood.animate(
            [{ opacity: 0.75 }, { opacity: 0 }],
            { duration: 600, easing: "ease-out", fill: "forwards" }
          );
        }, 1200);
      }

      await shake.finished;

      await attack.animate(
        [
          { transform: `translate(${moveX}px, ${moveY}px) scale(1.08)` },
          { transform: "translate(0,0) scale(1)" }
        ],
        { duration: 420, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      ).finished;

      attack.style.transform = "";
      attack.dataset.busy = "0";
    });
  });
});
/* ================= SHERLOCK EFFECT ================= */
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
// // scrolling above
// window.addEventListener("scroll", () => {
//     const bg = document.querySelector(".hero-bg");
//     const maxScroll = window.innerHeight * 0.8;
//     const scrollY = window.scrollY;

//     let opacity = 1 - scrollY / maxScroll;
//     if (opacity < 0) opacity = 0;

//     // smoother upward motion
//     let translateY = -(scrollY * 0.35);

//     bg.style.opacity = opacity;
//     bg.style.transform = `translateY(${translateY}px)`;
// });


const canvas = document.getElementById("cursor-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
let lastMove = Date.now();

let particles = [];

document.addEventListener("mousemove",(e)=>{
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastMove = Date.now();

  for(let i=0;i<4;i++){
    particles.push(new Particle(mouse.x,mouse.y));
  }
});

let hoveringClickable = false;
document.addEventListener("mousemove",(e)=>{

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastMove = Date.now();

  const style = window.getComputedStyle(e.target);
  hoveringClickable = style.cursor === "pointer";

  for(let i=0;i<4;i++){
    particles.push(new Particle(mouse.x,mouse.y));
  }

});




class Particle{
  constructor(x,y){
    this.x=x;
    this.y=y;

    this.size=Math.random()*3+1;

    this.speedX=(Math.random()-0.5)*2;
    this.speedY=(Math.random()-0.5)*2;

    this.life=80;

    this.hue=Math.random()*360;
  }

  update(){
    this.x+=this.speedX;
    this.y+=this.speedY;
    this.life--;
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=`hsla(${this.hue},100%,60%,${this.life/80})`;
    ctx.shadowColor=`hsl(${this.hue},100%,60%)`;
    ctx.shadowBlur=15;
    ctx.fill();
  }
}

function drawIdleCircles(){

  let idleTime = Date.now() - lastMove;

  if(idleTime < 200){
    return;
  }

  let t = Date.now()*0.002;

  let circles = [
    {r:18, speed:1},
    {r:28, speed:-0.7},
    {r:40, speed:0.5}
  ];

  circles.forEach((c,i)=>{

    let angle = t * c.speed;

    let x = mouse.x + Math.cos(angle)*c.r;
    let y = mouse.y + Math.sin(angle)*c.r;

    ctx.beginPath();
    ctx.arc(x,y,3,0,Math.PI*2);
    ctx.fillStyle=`hsl(${(t*80+i*90)%360},100%,65%)`;
    ctx.shadowBlur=12;
    ctx.shadowColor=ctx.fillStyle;
    ctx.fill();

  });

  ctx.beginPath();
  ctx.arc(mouse.x,mouse.y,12,0,Math.PI*2);
  ctx.strokeStyle="rgba(255,255,255,0.6)";
  ctx.lineWidth=1.5;
  ctx.stroke();
}

function animate(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<particles.length;i++){
    particles[i].update();
    particles[i].draw();

    if(particles[i].life<=0){
      particles.splice(i,1);
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
