 	document.addEventListener("DOMContentLoaded", () => {
	
	  // ----- Lore modal -----
	  const loreBtn = document.getElementById("loreBtn");
	  const loreModal = document.getElementById("loreModal");
	  const closeBtn = document.getElementById("closeModal");
	
	  if (loreBtn && loreModal && closeBtn) {
	    loreBtn.onclick = () => {
	      loreModal.classList.remove("hidden");
	      loreModal.classList.add("flex");
	    };
	
	    closeBtn.onclick = () => {
	      loreModal.classList.add("hidden");
	      loreModal.classList.remove("flex");
	    };
	  }
	
	  // ----- Deck system -----
	  const deckButtons = document.querySelectorAll(".deck-button");
	
	  deckButtons.forEach((btn) => {
	    btn.addEventListener("click", () => {
	      const id = btn.dataset.deck;
	      const deck = document.getElementById(id);
	      if (!deck) return;
	
	      const cards = deck.querySelectorAll(".deck-card");
	      const open = deck.classList.toggle("open");
	
	      const spread = 80;
	
	      cards.forEach((card, i) => {
	        const middle = (cards.length - 1) / 2;
	        const angle = (i - middle) * (spread / cards.length);
	
	        if (open) {
	          card.style.transform =
	            `translateX(-50%) rotate(${angle}deg) translateY(40px)`;
	        } else {
	          card.style.transform = `translateX(-50%) rotate(0deg)`;
	        }
	      });
	
	    });
	  });
	
	  // ----- Card click scroll -----
	  document.querySelectorAll(".deck-card").forEach((card) => {
	    card.addEventListener("click", (e) => {
	      e.stopPropagation();
	
	      const targetId = card.dataset.card;
	      const target = document.getElementById(targetId);
	
	      if (target) {
	        target.scrollIntoView({
	          behavior: "smooth",
	          block: "center"
	        });
	      }
	    });
	  });
	
	});
	
	// Cursor
	
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
	  if(idleTime < 200) return;
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

	// theme toggle 
	const btn = document.getElementById("theme-toggle");
	
	function updateThemeButton() {
	  btn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
	}
	
	btn.onclick = () => {
	  document.documentElement.classList.toggle("dark");
	  localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
	  updateThemeButton();
	};
	
	if (localStorage.theme === "dark") {
	  document.documentElement.classList.add("dark");
	} else if (localStorage.theme === "light") {
	  document.documentElement.classList.remove("dark");
	}
	
	updateThemeButton();

	const menuBtn = document.getElementById("menuBtn");
	const mobileMenu = document.getElementById("mobileMenu");
	
	menuBtn.addEventListener("click", () => {
	  mobileMenu.classList.toggle("hidden");
	});
