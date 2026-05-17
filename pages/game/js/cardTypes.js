document.addEventListener('DOMContentLoaded', function() {
          const rulesData = [
            { title: 'توضیح بازی و هدف', icon: 'flag-checkered', text: `بازی Unmatched یک بازی دوئل با مینیاتور است. هر بازیکن کنترل یک قهرمان افسانه‌ای (و گاهی دستیار او) را بر عهده می‌گیرد. هدف بازی ساده است: 
شما باید اولین نفری باشید که قهرمان حریف را شکست می‌دهد. 
یک مبارز زمانی شکست می‌خورد که نشانگر سلامتی او به صفر برسد.` },
            { title: 'ساختار نوبت', icon: 'rotate', text: `در نوبت خود، باید دقیقاً ۲ اقدام (Action) انجام دهید. شما نمی‌توانید از انجام یک اقدام صرف‌نظر کنید. می‌توانید دو اقدام متفاوت انتخاب کنید یا یک اقدام را دو بار انجام دهید.
اقدامات ممکن عبارتند از:
- مانور (Maneuver)
- نقشه (Scheme)
- حمله (Attack)

نکته مهم: در انتهای نوبت خود، اگر بیش از ۷ کارت در دست دارید، باید کارت‌های اضافه را بسوزانید (Discard) تا دقیقاً ۷ کارت برایتان باقی بماند.` },
            { title: 'اقدامات بازیکن', icon: 'bolt', text: `۱. مانور (Maneuver):
- ابتدا باید ۱ کارت بکشید. (اگر دک شما خالی باشد، مبارزان شما خسته شده و هر کدام ۲ آسیب می‌بینند).
- سپس می‌توانید مبارزان خود را به اندازه عدد حرکت روی کارت شخصیتشان در نقشه حرکت دهید.

۲. نقشه (Scheme):
- یک کارت با نماد "رعد و برق" (نقشه) از دست خود بازی کنید و اثر آن را فورا اعمال کنید.

۳. حمله (Attack):
- هدف حمله را مشخص کنید. (کلاس نزدیک‌زن فقط به مجاور، کلاس دورزن به مجاور یا هم‌رنگ منطقه).
- یک کارت حمله رو به پایین قرار دهید. مدافع می‌تواند یک کارت دفاع قرار دهد. سپس همزمان رو کنید.` }
          ];

          const cardsData = [
            { title: 'انواع کارت‌ها', icon: 'clone', text: `در بازی ۴ نوع کارت اصلی وجود دارد:

- کارت حمله (قرمز - نماد شمشیر): فقط مهاجم می‌تواند بازی کند.
- کارت دفاع (آبی - نماد سپر): فقط مدافع برای دفع حمله می‌تواند بازی کند.
- کارت چندمنظوره (بنفش - نماد شمشیر و سپر): هم به عنوان حمله و هم دفاع قابل استفاده است.
- کارت نقشه (زرد - نماد رعد و برق): در اکشن Scheme بازی می‌شود تا توانایی خاصی را فعال کند.` },
            { title: 'زمان‌بندی و اثرات', icon: 'stopwatch', text: `زمانی که در طول حمله کارت‌ها رو می‌شوند، متن روی کارت‌ها (اثرات) به ترتیب زیر اعمال می‌شوند:

۱. قبل از مبارزه (Before Combat): 
بلافاصله پس از رو شدن کارت‌ها و قبل از محاسبه آسیب.

۲. در طول مبارزه (During Combat): 
معمولاً مقادیر حمله یا دفاع را تغییر می‌دهند (قبل از وارد شدن آسیب).

۳. بعد از مبارزه (After Combat): 
پس از اینکه آسیب‌های حمله اعمال شد، اجرا می‌شوند.` },
            { title: 'مالکیت و مجاز بودن کارت', icon: 'id-badge', text: `روی هر کارت نام یک شخصیت نوشته شده است که مشخص می‌کند چه کسی می‌تواند آن را بازی کند:

- قهرمان (Hero): فقط قهرمان اصلی می‌تواند این کارت را بازی کند.
- دستیار (Sidekick): فقط دستیار(های) شما می‌توانند این را بازی کنند.
- هرکدام (Any): هر یک از مبارزان شما می‌توانند این کارت را بازی کنند.

مهم: اگر شخصیتی شکست خورده باشد (از صفحه خارج شده باشد)، دیگر نمی‌توانید کارت‌های مربوط به او را برای اقدام (اکشن) بازی کنید. اما می‌توانید آن‌ها را برای تقویت حرکت (Boost) بسوزانید.` }
          ];

          // Elements
          const rulesBtn = document.getElementById('btnToggleRules');
          const cardsBtn = document.getElementById('btnToggleCards');
          const rulesList = document.getElementById('rulesOptionsList');
          const cardsList = document.getElementById('cardsOptionsList');
          
          const modalOverlay = document.getElementById('modalOverlay');
          const modalContent = document.getElementById('modalContent');
          const modalTitle = document.getElementById('modalTitle');
          const modalText = document.getElementById('modalText');
          const closeModal = document.getElementById('closeModal');

          // Build lists
          function buildList(data, container) {
              data.forEach(item => {
                  const div = document.createElement('div');
                  div.className = 'p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl border-r-4 border-transparent hover:border-blue-500 transition-all cursor-pointer flex justify-between items-center shadow-sm';
                  div.innerHTML = `
                      <div class="flex items-center gap-3">
                          <i class="fas fa-${item.icon} text-blue-500 w-6 text-center"></i>
                          <h4 class="font-bold text-slate-800 dark:text-slate-200">${item.title}</h4>
                      </div>
                      <i class="fas fa-angle-left text-slate-400"></i>
                  `;
                  div.addEventListener('click', () => openModal(item.title, item.text));
                  container.appendChild(div);
              });
          }

          buildList(rulesData, rulesList);
          buildList(cardsData, cardsList);

          // Toggle logic
          function setupToggle(btn, list) {
              let isOpen = false;
              btn.addEventListener('click', () => {
                  isOpen = !isOpen;
                  if (isOpen) {
                      list.classList.remove('hidden');
                      btn.querySelector('span').textContent = 'مخفی کردن';
                      btn.querySelector('i').className = 'fas fa-times';
                  } else {
                      list.classList.add('hidden');
                      btn.querySelector('span').textContent = 'مشاهده مباحث';
                      btn.querySelector('i').className = 'fas fa-arrow-left';
                  }
              });
          }
          setupToggle(rulesBtn, rulesList);
          setupToggle(cardsBtn, cardsList);

          // Modal Logic
          function openModal(title, text) {
              modalTitle.textContent = title;
              modalText.textContent = text;
              modalOverlay.classList.remove('hidden');
              // small delay for transition
              setTimeout(() => {
                  modalOverlay.classList.remove('opacity-0');
                  modalContent.classList.remove('scale-95');
                  modalContent.classList.add('scale-100');
              }, 10);
          }

          function closeMod() {
              modalOverlay.classList.add('opacity-0');
              modalContent.classList.remove('scale-100');
              modalContent.classList.add('scale-95');
              setTimeout(() => {
                  modalOverlay.classList.add('hidden');
              }, 300);
          }

          closeModal.addEventListener('click', closeMod);
          modalOverlay.addEventListener('click', (e) => {
              if (e.target === modalOverlay) closeMod();
          });

          // Theme Toggle
          const themeBtn = document.getElementById("theme-toggle");
          function updateThemeBtn() {
            themeBtn.textContent = document.documentElement.classList.contains("dark") ? "☀️ روشن" : "🌙 تیره";
          }
          themeBtn.onclick = () => {
            document.documentElement.classList.toggle("dark");
            localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
            updateThemeBtn();
          };
          if (localStorage.theme === "dark") document.documentElement.classList.add("dark");
          else if (localStorage.theme === "light") document.documentElement.classList.remove("dark");
          updateThemeBtn();

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
          }
      );