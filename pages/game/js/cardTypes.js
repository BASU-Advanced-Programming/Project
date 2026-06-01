document.addEventListener('DOMContentLoaded', function() {
    // ۱. اضافه شدن ویژگی image به داده‌ها (آدرس‌های خود را در بخش کامنت شده قرار دهید)
    const rulesData = [
      { 
        title: 'توضیح بازی و هدف', 
        icon: 'flag-checkered', 
        text: `بازی Unmatched یک بازی دوئل با مینیاتور است. هر بازیکن کنترل یک قهرمان افسانه‌ای (و گاهی دستیار او) را بر عهده می‌گیرد. هدف بازی ساده است: 
شما باید اولین نفری باشید که قهرمان حریف را شکست می‌دهد. 
یک مبارز زمانی شکست می‌خورد که نشانگر سلامتی او به صفر برسد.`,
        //image: '../../../images/art1.png' 
      },
      { 
        title: 'ساختار نوبت', 
        icon: 'rotate', 
        text: `در نوبت خود، باید دقیقاً ۲ اقدام (Action) انجام دهید. شما نمی‌توانید از انجام یک اقدام صرف‌نظر کنید. می‌توانید دو اقدام متفاوت انتخاب کنید یا یک اقدام را دو بار انجام دهید.
اقدامات ممکن عبارتند از:
- مانور (Maneuver)
- نقشه (Scheme)
- حمله (Attack)

نکته مهم: در انتهای نوبت خود، اگر بیش از ۷ کارت در دست دارید، باید کارت‌های اضافه را بسوزانید (Discard) تا دقیقاً ۷ کارت برایتان باقی بماند.`,
        //image: '../../../images/art2.png' 
      },
      { 
        title: 'اقدامات بازیکن', 
        icon: 'bolt', 
        text: `۱. مانور (Maneuver):
- مرحله اول – کشیدن کارت (اجباری): شما حتماً باید ۱ کارت از دک خود بکشید. این بخش از مانور اختیاری نیست.
- اگر دک شما خالی باشد و نتوانید کارت بکشید، مبارزان شما خسته شده و هر کدام ۲ آسیب می‌بینند.
- مرحله دوم – حرکت (اختیاری): پس از کشیدن کارت، می‌توانید مبارزان خود را حرکت دهید. حرکت دادن کاملاً اختیاری است. هر مبارز می‌تواند تا سقف عدد حرکتِ نوشته شده روی کارت شخصیتش جابه‌جا شود یا حتی صفر خانه حرکت کند.

۲. نقشه (Scheme):
- یک کارت نقشه (با نماد رعد و برق) از دست خود انتخاب کرده و آن را بازی کنید.
- اثر کارت بلافاصله اجرا می‌شود.
- پس از اجرای اثر، کارت در دسته کارت‌های سوخته قرار می‌گیرد.

۳. حمله (Attack):
در اقدام حمله، ابتدا باید یکی از مبارزان خود را به عنوان مبارز فعال اعلام کنید و سپس یک هدف مجاز انتخاب نمایید.

قواعد هدف‌گیری:
- مبارزان نزدیک‌زن (Melee) فقط می‌توانند به دشمن مجاور حمله کنند.
- مبارزان دورزن (Ranged) می‌توانند به دشمن مجاور یا هر دشمنی که در همان ناحیه (Zone) قرار دارد حمله کنند.

روند انجام حمله:
- مهاجم یک کارت حمله از دست خود انتخاب کرده و آن را رو به پایین قرار می‌دهد.
- مدافع می‌تواند در صورت تمایل یک کارت دفاع انتخاب کرده و آن را رو به پایین قرار دهد.
- سپس هر دو کارت همزمان رو می‌شوند.

پس از رو شدن کارت‌ها، مراحل مبارزه به ترتیب زیر انجام می‌شود:
1. اجرای اثرات فوری (Immediately)
2. اجرای اثرات در طول نبرد (During Combat)
3. محاسبه و اعمال آسیب
4. اجرای اثرات بعد از نبرد (After Combat)

در پایان، کارت‌های بازی‌شده در دسته کارت‌های سوخته قرار می‌گیرند. اگر دو اثر همزمان فعال شوند، ابتدا اثر مدافع اجرا می‌شود.
`,
        //image:  
      }
    ];

    const cardsData = [
      { 
        title: 'انواع کارت‌ها', 
        icon: 'clone', 
        text: `در بازی ۴ نوع کارت اصلی وجود دارد:

- کارت حمله (قرمز - نماد ضربه): فقط مهاجم می‌تواند بازی کند.
- کارت دفاع (آبی - نماد سپر): فقط مدافع برای دفع حمله می‌تواند بازی کند.
- کارت چندمنظوره (بنفش - نماد شمشیر و سپر): هم به عنوان حمله و هم دفاع قابل استفاده است.
- کارت نقشه (زرد - نماد رعد و برق): در اکشن Scheme بازی می‌شود تا توانایی خاصی را فعال کند.`,
        image:  '../../../images/rulesCard.png'   
      },
      { 
      title: 'زمان‌بندی و اثرات کارت‌ها',
    icon: 'stopwatch',
    text: `در بازی Unmatched، زمان‌بندی اجرای اثرات کارت‌های مبارزه بسیار حیاتی است. این اثرات به سه دسته اصلی تقسیم می‌شوند:

۱. اثرات فوری (Immediately): بلافاصله پس از رو شدن کارت‌ها اجرا می‌شوند.
۲. در طول نبرد (During Combat): پیش از محاسبه آسیب، مقدار حمله یا دفاع را تغییر می‌دهند.
۳. بعد از نبرد (After Combat): پس از محاسبه و اعمال آسیب اجرا می‌شوند.

`,
    linkText: '⚔️ جزئیات حل‌وفصل یک حمله',
    linkUrl: '../html/combat.html',
    image: '../../../images/rulesCard.png'
      },
      { 
        title: 'مالکیت و مجاز بودن کارت', 
        icon: 'id-badge', 
        text: `روی هر کارت نام یک شخصیت نوشته شده است که مشخص می‌کند چه کسی می‌تواند آن را بازی کند:

- قهرمان (Hero): فقط قهرمان اصلی می‌تواند این کارت را بازی کند.
- دستیار (Sidekick): فقط دستیار(های) شما می‌توانند این را بازی کنند.
- هرکدام (Any): هر یک از مبارزان شما می‌توانند این کارت را بازی کنند.

مهم: اگر شخصیتی شکست خورده باشد (از صفحه خارج شده باشد)، دیگر نمی‌توانید کارت‌های مربوط به او را برای اقدام (اکشن) بازی کنید. اما می‌توانید آن‌ها را برای تقویت حرکت (Boost) بسوزانید.`,
        image: '../../../images/rulesCard.png' 
      }
    ];

    // Elements
    const rulesBtn = document.getElementById('btnToggleRules');
    const cardsBtn = document.getElementById('btnToggleCards');
    const rulesList = document.getElementById('rulesOptionsList');
    const cardsList = document.getElementById('cardsOptionsList');
    
    const longTextContainer = document.getElementById('longTextContainer');
    const longTextTitle = document.getElementById('longTextTitle');
    const longTextContent = document.getElementById('longTextContent');
    const closeLongText = document.getElementById('closeLongText');
    const longTextImageContainer = document.getElementById('longTextImageContainer');
    const longTextImage = document.getElementById('longTextImage');

    const imageLightbox = document.getElementById("imageLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = document.getElementById("closeLightbox");

  // باز کردن پاپ‌آپ هنگام کلیک روی عکس
  if (longTextImage && imageLightbox) {
    longTextImage.addEventListener("click", () => {
      // انتقال سورس عکس اصلی به عکس پاپ‌آپ
      lightboxImage.src = longTextImage.src;
      
      // نمایش کانتینر
      imageLightbox.classList.remove("hidden");
      
      // افکت انیمیشن (با کمی تاخیر برای اعمال شدن کلاس hidden)
      setTimeout(() => {
        imageLightbox.classList.remove("opacity-0");
        lightboxImage.classList.remove("scale-95");
        lightboxImage.classList.add("scale-100");
      }, 10);
    });
  }

  // تابع بستن پاپ‌آپ
  const hideLightbox = () => {
    imageLightbox.classList.add("opacity-0");
    lightboxImage.classList.remove("scale-100");
    lightboxImage.classList.add("scale-95");
    
    // مخفی کردن کانتینر بعد از اتمام انیمیشن
    setTimeout(() => {
      imageLightbox.classList.add("hidden");
    }, 300); // 300ms برابر با duration-300 در CSS
  };

  // بستن پاپ‌آپ با کلیک روی دکمه ضربدر
  if (closeLightbox) {
    closeLightbox.addEventListener("click", hideLightbox);
  }

  // بستن پاپ‌آپ با کلیک روی فضای خالی (پس‌زمینه تیره)
  if (imageLightbox) {
    imageLightbox.addEventListener("click", (e) => {
      if (e.target === imageLightbox) {
        hideLightbox();
      }
    });
  }

    // Build lists
    function buildList(data, container) {
        data.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'animate-fade-in-up p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl border-r-4 border-transparent hover:border-blue-500 transition-all cursor-pointer flex justify-between items-center shadow-sm relative z-20';
            div.style.animationDelay = `${index * 0.1}s`;
            
            div.innerHTML = `
                <div class="flex items-center gap-3 pointer-events-none">
                    <i class="fas fa-${item.icon} text-blue-500 w-6 text-center"></i>
                    <h4 class="font-bold text-slate-800 dark:text-slate-200">${item.title}</h4>
                </div>
                <i class="fas fa-angle-left text-slate-400 pointer-events-none"></i>
            `;
            // ۲. ارسال پارامتر image به تابع
            div.addEventListener('click', () => openLongText(item.title, item.text, item.image, item.linkText, item.linkUrl));
        
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

    // Long Text Container Logic
 function openLongText(title, text, imageUrl, linkText = null, linkUrl = null) {
    longTextTitle.textContent = title;
    
    // متن اصلی را به همراه لینک در یک پاراگراف ادغام می‌کنیم
    let finalContent = text;
    
    if (linkText && linkUrl) {
        finalContent += `\n\nجهت مشاهده جزئیات بیشتر، <a href="${linkUrl}" class="text-purple-600 dark:text-purple-400 font-bold hover:underline decoration-2 underline-offset-4 transition-all">اینجا کلیک کنید</a>.`;
    }
    
    // استفاده از یک پاراگراف واحد برای اینکه همه چیز یکپارچه باشد
    longTextContent.innerHTML = `<p class="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">${finalContent}</p>`;
    
    // تنظیمات تصویر
    if (imageUrl && imageUrl.trim() !== '') {
        longTextImage.src = imageUrl;
        longTextImageContainer.classList.remove('hidden');
        longTextContent.classList.replace('md:col-span-12', 'md:col-span-7');
    } else {
        longTextImageContainer.classList.add('hidden');
        longTextContent.classList.replace('md:col-span-7', 'md:col-span-12');
    }

    longTextContainer.classList.remove('hidden');
    longTextContainer.classList.add('animate-fade-in-up');
    
    setTimeout(() => {
        longTextContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
}


    closeLongText.addEventListener('click', () => {
        longTextContainer.classList.add('hidden');
        longTextContainer.classList.remove('animate-fade-in-up');
    });
// Music Logic
const musicToggleBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bgMusic');

if (bgMusic && musicToggleBtn) {
    bgMusic.volume = 0.3;
    let isMusicPlaying = false;

    musicToggleBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            // Using FontAwesome icon class instead of emoji
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
            // Using FontAwesome icon class instead of emoji
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    });
}


    // Theme Toggle
    const themeBtn = document.getElementById("theme-toggle");
    function updateThemeBtn() {
      themeBtn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
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
});
