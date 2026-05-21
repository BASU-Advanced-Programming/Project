
  const themeBtn = document.getElementById("theme-toggle");
        function updateThemeBtn() {
            themeBtn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
        }
        themeBtn.onclick = () => {
            document.documentElement.classList.toggle("dark");
            localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
            updateThemeBtn();
        };
        if (localStorage.theme === "dark" || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        updateThemeBtn();

        function calculateCombat() {
            const atk = parseInt(document.getElementById('atkVal').value) || 0;
            const def = parseInt(document.getElementById('defVal').value) || 0;
            const resultBox = document.getElementById('resultBox');
            const damageResult = document.getElementById('damageResult');
            const winnerResult = document.getElementById('winnerResult');

            resultBox.classList.remove('hidden');
            
            let damage = atk - def;
            if (damage < 0) damage = 0;

            damageResult.innerHTML = `مقدار آسیب دریافتی: <span class="text-red-500 text-3xl mx-2 font-black">${damage}</span>`;

            if (damage > 0) {
                winnerResult.innerHTML = '🏆 <span class="text-red-500">مهاجم برنده نبرد شد! (At least 1 damage)</span>';
            } else {
                winnerResult.innerHTML = '🛡️ <span class="text-green-500">مدافع برنده نبرد شد! (0 damage taken)</span>';
            }
        }
const canvas = document.getElementById("cursor-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let hoveringClickable = false;

  let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
  let lastMove = Date.now();

  let particles = [];

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
