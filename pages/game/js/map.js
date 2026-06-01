
console.log('فایل script.js بارگذاری شد');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM آماده است');
    
    const movementBox = document.getElementById('showMovementOptions');
    const mapBox = document.getElementById('showMapOptions');
    const movementOptions = document.getElementById('movementOptions');
    const mapOptions = document.getElementById('mapOptions');
    const longTextContainer = document.getElementById('longTextContainer');
    const longTextTitle = document.getElementById('longTextTitle');
    const longTextContent = document.getElementById('longTextContent');
    const closeLongTextBtn = document.getElementById('closeLongText');
    
    if (longTextContent) {
        longTextContent.style.whiteSpace = 'pre-wrap';
    }
    
const movementData = [
  {
    id: 'move1',
    title: 'حرکت پیاپی و مجاورت',
    text: `1. حرکت پیاپی و مجاورت:
هر خانه‌ای که مبارز در آن حرکت می‌کند باید با خانه‌ی قبلی مجاور (Adjacent) باشد؛ یعنی میان آن‌ها خطی در نقشه کشیده شده باشد. جابه‌جایی دوربرد تنها از طریق اثرهای ویژه یا گذرگاه‌های مخفی ممکن است.

2. عبور از میان نیروهای هم‌تیمی:
مبارز می‌تواند از خانه‌هایی که هم‌رزمان خودش در آن هستند عبور کند؛ اما حق ندارد در همان خانه توقف کند.

3. محدودیت در برابر نیروهای دشمن:
خانه‌ای که توسط دشمن اشغال شده باشد، مسیر بسته محسوب می‌شود و مبارز نمی‌تواند از آن عبور کند یا وارد آن شود.

4. حرکت ناشی از اثرات کارت‌ها:
اگر کارت یا توانایی خاصی باعث حرکت اجباری مبارز شود ، همچنان قوانین پایه‌ی حرکت رعایت می‌شود، مگر متن کارت صراحتاً استثنا قائل شده باشد.`
  },
{
  id: 'move2',
  title: 'افزایش حرکت (Boost)',
  text: `حرکت را می‌توان با عمل Boost تقویت کرد.

زمانی‌که بازیکن از عمل Maneuver استفاده می‌کند، می‌تواند یک کارت از دست خود را دور بیندازد و عدد Boost روی آن کارت را به مقدار حرکت خود اضافه کند.

اثرهای دیگر درج‌شده بر روی آن کارت در این حالت نادیده گرفته می‌شوند و اجرا نمی‌شوند.

برخی اثرهای خاص نیز اجازه می‌دهند Boost برای چیزهای دیگری استفاده شود؛
برای مثال ممکن است کارتی اجازه دهد مقدار Boost به قدرت حمله اضافه شود.

همچنین کارت‌هایی که دیگر به‌صورت عادی قابل بازی نیستند , مثلاً به این دلیل که مبارز مرتبط با آن‌ها شکست خورده است , همچنان می‌توانند از دست بازیکن دور انداخته شوند تا برای Boost استفاده شوند.

به‌طور مثال:
اگر مقدار حرکت شخصیت دراکولا برابر با 2 باشد و کارت دورریخته‌شده دارای مقدار افزایش حرکت 3 باشد، مجموع حرکت در آن نوبت برابر 5 خانه خواهد بود.`
},
  {
    id: 'move3',
    title: 'قوانین ویژه‌ی حرکت',
    text: `این نقشه‌ دارای عناصر خاصی هست که روش حرکت را تغییر می‌دهد، مانند گذرگاه‌های مخفی (Secret Passages).

قواعد گذرگاه مخفی:
• مبارز می‌تواند از خانه‌ای که علامت "گذرگاه مخفی" دارد، به هر خانه‌ی دیگری که همین علامت را دارد حرکت کند، گویی این دو خانه مجاور هستند.  
• این جابه‌جایی همچنان به‌اندازه‌ی ۱ واحد حرکت محاسبه می‌شود.  
• فضاهای دارای گذرگاه مخفی برای هیچ منظور دیگری (مانند حمله‌ی نزدیک یا اثر کارت) مجاور در نظر گرفته نمی‌شوند.  
`
  }
];

const mapData = [
  {
    id: 'map1',
    title: 'ساختار نقشه',
    text: `نقشه‌ی نبرد از مجموعه‌ای از خانه‌ها (Spaces) تشکیل شده است که با خطوط و رنگ‌ها از یکدیگر جدا می‌شوند. هر خانه تنها می‌تواند یک مبارز را در خود جای دهد.

1. مجاورت (Adjacency):  
خانه‌هایی که با خط به هم وصل شده‌اند، مجاور محسوب می‌شوند. از این قانون برای تعیین حملات نزدیک و برخی اثرات کارت‌ها استفاده می‌شود.

2. منطقه‌ها (Zones):  
نقشه به مناطق رنگی تقسیم شده است. همه‌ی خانه‌هایی که رنگ یکسان دارند، بخشی از یک Zone واحد هستند، حتی اگر در دو نقطه‌ی مختلف نقشه واقع شده باشند.  
اگر خانه‌ای چند رنگ داشته باشد، متعلق به چند Zone است. Zoneها برای مشخص کردن هدف حملات دوربرد و سایر اثرها به کار می‌روند.

3. ویژگی‌های خاص نقشه:  
برخی خانه‌ها ممکن است دارای عناصر ویژه مانند گذرگاه مخفی (Secret Passage) باشند که قواعد حرکت معمول را تغییر می‌دهد.`
  },
  {
    id: 'map2',
    title: 'گذرگاه‌های مخفی',
text: `<div class="flex items-start gap-6"><div class="flex-1 text-justify leading-relaxed"> در نقشه ی "Baskerville Manor" سیستمی از گذرگاه های مخفی وجود دارد که به مبارزان اجازه می دهد سریع بین بخش های مختلف نقشه حرکت کنند.
        <br>
<strong class="text-white">قوانین گذرگاه مخفی:</strong>
1. هر خانه ی دارای نماد گذرگاه مخفی می تواند با تمام خانه های دیگر دارای همین نماد ارتباط داشته باشد.
2. حرکت از یک گذرگاه به گذرگاه دیگر، فقط ۱ واحد حرکت هزینه دارد.
3. خانه های دارای گذرگاه مخفی برای حمله های نزدیک یا اثرات دیگر مجاور قلمداد نمی شوند.
4. همه ی مبارزان می توانند از آن استفاده کنند، مگر کارت یا اثر دیگری محدودیت اعمال کند.
    </div>
    <img src="../../../images/portal.png" alt="گذرگاه مخفی" class="w-24 h-24 object-contain drop-shadow-md rounded-md shrink-0" />

</div>
`
  },
  {
    id: 'map3',
    title: 'قوانین استقرار بازیکنان و هم‌رزمان',
    text: `قواعد استقرار اولیه (Initial Placement):

1. موقعیت پایه:
• بازیکن جوان‌تر قهرمان خود را در Space 1 قرار می‌دهد.  
• بازیکن مسن‌تر قهرمان خود را در Space 2 قرار می‌دهد.  
این موقعیت‌ها ثابت‌اند و انتخاب جایگزین ندارند.

2. استقرار هم‌رزمان (Sidekicks):
• هر هم‌رزمان باید در خانه‌ای جداگانه و درون همان Zone قهرمان قرار بگیرد.  
• اگر خانه‌ی قهرمان در چند Zone قرار داشته باشد، هم‌رزمان می‌توانند در هر کدام از آن Zoneها مستقر شوند.  
• دو مبارز نمی‌توانند در یک خانه قرار گیرند.  
• Zoneها روی نقشه با رنگ مشخص می‌شوند.

3. ترتیب اجرا:
   1. بازیکن جوان‌تر ابتدا قهرمان را می‌گذارد، سپس هم‌رزمان.  
   2. سپس بازیکن مسن‌تر به همین شکل عمل می‌کند.

4. سلامتی هم‌رزمان:
هم‌رزمانی که صفحه‌ی سلامتی مستقل ندارند و با سلامتی ۱ وارد بازی می‌شوند.

5. شروع بازی:
بازی با بازیکن جوان‌تر آغاز می‌شود.`
  }
];

    
    
    function createOptionElement(data, type) {
        const div = document.createElement('div');
div.className =
'p-4 bg-[#0b1510]/80 hover:bg-[#102017] rounded-2xl border border-green-950 hover:border-green-500 transition-all duration-300 cursor-pointer group backdrop-blur-lg';        div.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center group-hover:bg-green-800 transition">
                        <i class="fas fa-${type === 'movement' ? 'running' : 'map-marked'} text-green-200"></i>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-200 group-hover:text-white">${data.title}</h4>
                </div>
                <i class="fas fa-chevron-left text-gray-500 group-hover:text-green-400 transition"></i>
            </div>
        `;
        
        div.addEventListener('click', () => {
            showLongText(data.title, data.text);
            div.style.transform = 'scale(0.98)';
            setTimeout(() => { div.style.transform = 'scale(1)'; }, 150);
        });
        
        return div;
    }
    
    if (movementOptions) {
        movementData.forEach(item => movementOptions.appendChild(createOptionElement(item, 'movement')));
        movementOptions.style.display = 'none';
    }
    if (mapOptions) {
        mapData.forEach(item => mapOptions.appendChild(createOptionElement(item, 'map')));
        mapOptions.style.display = 'none';
    }
    
    function showLongText(title, content) {
        if(!longTextTitle || !longTextContent || !longTextContainer) return;
        longTextTitle.textContent = title;
        longTextContent.innerHTML = content;
        longTextContainer.classList.remove('hidden');
        longTextContainer.classList.add('block');
        
        longTextContainer.scrollIntoView({ behavior: 'smooth' });
        longTextContainer.style.opacity = '0';
        longTextContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            longTextContainer.style.transition = 'all 0.5s ease';
            longTextContainer.style.opacity = '1';
            longTextContainer.style.transform = 'translateY(0)';
        }, 10);
    }
    
    function hideLongText() {
        if(!longTextContainer) return;
        longTextContainer.style.opacity = '0';
        longTextContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            longTextContainer.classList.add('hidden');
            longTextContainer.classList.remove('block');
        }, 500);
    }
    
    let isMovementVisible = false;
    function toggleMovementOptions() {
        if (!movementOptions || !movementBox) return;
        if (isMovementVisible) {
            movementOptions.style.opacity = '0';
            setTimeout(() => { movementOptions.style.display = 'none'; }, 300);
            movementBox.innerHTML = '<i class="fas fa-chevron-down"></i><span>نمایش گزینه‌های حرکت</span>';
        } else {
            movementOptions.style.display = 'block';
            setTimeout(() => { movementOptions.style.opacity = '1'; }, 10);
            movementOptions.style.transition = 'opacity 0.3s ease';
            movementBox.innerHTML = '<i class="fas fa-chevron-up"></i><span>مخفی کردن گزینه‌ها</span>';
        }
        isMovementVisible = !isMovementVisible;
    }
    
    let isMapVisible = false;
    function toggleMapOptions() {
        if (!mapOptions || !mapBox) return;
        if (isMapVisible) {
            mapOptions.style.opacity = '0';
            setTimeout(() => { mapOptions.style.display = 'none'; }, 300);
            mapBox.innerHTML = '<i class="fas fa-chevron-down"></i><span>نمایش گزینه‌های نقشه</span>';
        } else {
            mapOptions.style.display = 'block';
            setTimeout(() => { mapOptions.style.opacity = '1'; }, 10);
            mapOptions.style.transition = 'opacity 0.3s ease';
            mapBox.innerHTML = '<i class="fas fa-chevron-up"></i><span>مخفی کردن گزینه‌ها</span>';
        }
        isMapVisible = !isMapVisible;
    }
    
    if (movementBox) movementBox.addEventListener('click', toggleMovementOptions);
    if (mapBox) mapBox.addEventListener('click', toggleMapOptions);
    if (closeLongTextBtn) closeLongTextBtn.addEventListener('click', hideLongText);
    
    const boxes = document.querySelectorAll('.dark-box');
    boxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'translateY(-5px)';
            box.style.transition = 'transform 0.3s';
        });
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'translateY(0)';
        });
    });

    const toggleSoundBtn = document.getElementById('toggleSound');
    const themeAudio = document.getElementById('themeAudio');
    let isPlaying = false;
    
    if (toggleSoundBtn && themeAudio) {
        themeAudio.volume = 0.5;
        
        toggleSoundBtn.addEventListener('click', () => {
            if (isPlaying) {
                themeAudio.pause();
                toggleSoundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                toggleSoundBtn.classList.remove('text-green-400');
                toggleSoundBtn.classList.add('text-red-400');
            } else {
                themeAudio.play().catch(error => console.log("خطا در پخش صدا:", error));
                toggleSoundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                toggleSoundBtn.classList.remove('text-red-400');
                toggleSoundBtn.classList.add('text-green-400');
            }
            isPlaying = !isPlaying;
        });
    }

    const cursorCanvas = document.getElementById("cursor-canvas");
    if (cursorCanvas) {
        const ctx = cursorCanvas.getContext("2d");
        
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            cursorCanvas.width = window.innerWidth;
            cursorCanvas.height = window.innerHeight;
        });

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let lastMove = Date.now();
        let particles = [];
        let hoveringClickable = false;

        document.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            lastMove = Date.now();

            const style = window.getComputedStyle(e.target);
            hoveringClickable = style.cursor === "pointer" || e.target.closest('button, a, .cursor-pointer');

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
                ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.life / 80})`;
                ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
                ctx.shadowBlur = 15;
                ctx.fill();
            }
        }

        function drawIdleCircles() {
            let idleTime = Date.now() - lastMove;
            if (idleTime < 200) return;

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
                ctx.fillStyle = `hsl(${(t * 80 + i * 90) % 360}, 100%, 65%)`;
                ctx.shadowBlur = 12;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fill();
            });

            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        function animateCursor() {
            ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

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
                ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
                ctx.lineWidth = 2;
                ctx.shadowBlur = 15;
                ctx.shadowColor = "white";
                ctx.stroke();
            }

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    console.log('%c UNMATCHED - سیستم با موفقیت بارگذاری شد', 'color: #00ff00; font-size: 16px; font-weight: bold;');
});

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
