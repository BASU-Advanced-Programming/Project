
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
            title: 'حرکت پیاپی و مجاورتی',
            text: `1. حرکت پیاپی و مجاورتی:
هر خانه‌ای که مبارز به آن وارد می‌شود باید با خانه‌ی قبلی‌اش مجاور باشد؛ یعنی جابه‌جایی فقط از خانه‌هایی که توسط خطوط در نقشه بازی مشخص شده‌اند انجام می‌شود و عبورهای دوربرد وجود ندارد (مگر به‌واسطه‌ی اثرهای خاص یا گذرگاه‌های نقشه).

2. عبور از میان نیروهای خودی:
مبارز می‌تواند از خانه‌هایی که توسط نیروهای خودش اشغال شده عبور کند، اما نمی‌تواند در همان خانه متوقف شود.

3. محدودیت در برابر نیروهای دشمن:
عبور از میان مبارزان حریف ممکن نیست؛ خانه‌ای که دشمن در آن قرار دارد، مانع کامل حرکت محسوب می‌شود.

4. اثرات ناشی از قوانین ویژه:
اگر هرگونه اثر یا کارت باعث شود که مبارزان حریف جابه‌جا شوند، همان قواعد حرکت باز هم باید رعایت شوند، ولی از دیدگاه موقعیت مبارزان حریف.`
        },
        {
            id: 'move2',
            title: 'افزایش حرکت (Boost)',
            text: `حرکت را می‌توان با عمل Boost تقویت کرد.

زمانی‌که بازیکن از عمل Maneuver استفاده می‌کند، می‌تواند یک کارت از دست خود را دور بیندازد و عدد Boost روی آن کارت را به مقدار حرکت خود اضافه کند.

اثرهای دیگر درج‌شده بر روی آن کارت در این حالت نادیده گرفته می‌شوند و اجرا نمی‌شوند.

به‌طور مثال:
اگر مقدار حرکت شخصیت دراکولا برابر با 2 باشد و کارت دورریخته‌شده دارای مقدار افزایش حرکت 3 باشد، مجموع حرکت در آن نوبت برابر 5 خانه خواهد بود.`
        },
        {
            id: 'move3',
            title: 'قوانین ویژه حرکت',
            text: `در نقشه‌ی بازی، عناصر ویژه‌ای وجود دارند که قواعد حرکت را تغییر می‌دهند:

• Secret Passage (گذرگاه مخفی):
مبارزان می‌توانند از خانه‌ای که دارای “Secret Passage” است به هر خانه‌ی دیگری با “Secret Passage” حرکت کنند، گویا این خانه‌ها مجاور هستند.

این حرکت همچنان 1 واحد از مقدار حرکت محاسبه می‌شود.`
        }
    ];

    const mapData = [
        {
            id: 'map1',
            title: 'ساختار نقشه',
            text: `نقشه به مجموعه‌ای از خانه‌ها تقسیم شده که هرکدام با رنگ‌ها یا مرزهای منطقه‌ای جدا می‌شوند.

• برخی خانه‌ها دارای ویژگی‌های خاص نظیر گذرگاه مخفی هستند.

• موقعیت‌یابی دقیق مبارزان روی نقشه تأثیر مستقیم بر نحوه‌ی حمله، دفاع و اثرگذاری کارت‌ها دارد.`
        },
        {
            id: 'map2',
            title: 'گذرگاه‌های مخفی',
            text: `ویژگی برجسته‌ی نقشه، وجود گذرگاه‌های مخفی است.

بازیکنان می‌توانند از این مسیرها برای جابه‌جایی سریع بین بخش‌های دور نقشه استفاده کنند.

قوانین مربوط به گذرگاه مخفی:

1. اگر یک مبارز در خانه‌ای با گذرگاه مخفی باشد، می‌تواند به هر خانه‌ی دیگری که این علامت را دارد انتقال یابد.

2. این انتقال همانند حرکت معمول، 1 واحد از مقدار حرکت محاسبه می‌شود.

3. این مسیرها برای همه مبارزان قابل استفاده هستند، مگر اینکه کارت یا اثر خاص محدودیتی تعیین کند.

در نتیجه بازیکنان می‌توانند از این قابلیت برای:
• حمله از جهت غیرمنتظره
• فرار از محاصره‌ی دشمن
• یا رسیدن سریع به موقعیت مطلوب استفاده کنند.`
        },
        {
            id: 'map3',
            title: 'قوانین استقرار بازیکنان و هم‌رزمان',
            text: `قوانین استقرار اولیه بازیکنان و هم‌رزمان (Initial Placement Rules)

1. موقعیت‌های پایه
• بازیکن جوان‌تر قهرمان خود را در Space 1 قرار می‌دهد.
• بازیکن مسن‌تر قهرمان خود را در Space 2 قرار می‌دهد.

این دو موقعیت ثابت بوده و هیچ انتخاب جایگزینی ندارند.

2. استقرار هم‌رزمان (Sidekicks)
• تمامی هم‌رزمان باید در خانه‌های مجزا و درون همان Zone قهرمان قرار گیرند.
• اگر خانه‌ی شروع قهرمان در چند Zone قرار داشته باشد، هم‌رزمان می‌توانند در هر یک از Zoneهای مرتبط مستقر شوند.
• قرارگیری چند مبارز در یک Space مجاز نیست.
• این Zoneها در نقشه با رنگ مشخص شده‌اند.

3. ترتیب اجرا
1. بازیکن جوان‌تر: استقرار قهرمان در Space 1، سپس جای‌گذاری هم‌رزمان طبق قواعد فوق.
2. بازیکن مسن‌تر: استقرار قهرمان در Space 2، سپس جای‌گذاری هم‌رزمان طبق قواعد مشابه.

• هم‌رزمان فاقد صفحه سلامتی مستقل هستند و با سلامت اولیه ۱ وارد بازی می‌شنود.

4. آغاز بازی
• بازی با بازیکن جوان‌تر آغاز می‌شود.`
        }
    ];
    
    
    function createOptionElement(data, type) {
        const div = document.createElement('div');
        div.className = 'p-4 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 cursor-pointer group';
        div.innerHTML = `
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
        longTextContent.textContent = content;
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
