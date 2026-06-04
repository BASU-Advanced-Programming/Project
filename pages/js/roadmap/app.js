(function () {
  const C = window.RoadmapComponents;
  const IMG = "../images/";
  const GAME = "game/html/";

  const NAV = [
    { id: "downloads", title: "دانلود و منابع" },
    { id: "overview", title: "مرور بازی" },
    { id: "heroes", title: "مبارزها" },
    { id: "map-cards", title: "نقشه و کارت" },
    { id: "combat", title: "مبارزه" },
    { id: "delivery", title: "تحویل پروژه" },
  ];

  function buildNav() {
    const nav = document.getElementById("roadmap-nav-list");
    if (!nav) return;
    NAV.forEach((item, i) => {
      nav.appendChild(C.ProgressStep({ number: i + 1, label: item, active: i === 0 }));
    });
  }

  function buildHero() {
    const root = document.getElementById("roadmap-hero");
    if (!root) return;
    root.innerHTML = `
      <div data-hero-layer="0.15" class="absolute inset-0 bg-[url('${IMG}art1.png')] bg-cover bg-center opacity-40"></div>
      <div data-hero-layer="0.08" class="absolute -left-1/4 top-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px]"></div>
      <div data-hero-layer="0.12" class="absolute -right-1/4 bottom-0 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[100px]"></div>
      <div data-hero-content class="relative z-10 max-w-4xl mx-auto px-5 text-center pt-32 pb-24">
        <span class="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">فاز اول · UNMATCHED</span>
        <h1 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-wide">نقشه راه پیاده‌سازی</h1>
        <p class="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">از دانلود نسخه مرجع بازی تا قوانین نبرد — همه چیز برای شروع موتور C++ شما در یک مسیر منظم.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#downloads" class="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg">شروع از منابع</a>
          <a href="../index.html" class="px-6 py-3 rounded-full border border-white/20 text-slate-200 hover:bg-white/10 font-semibold transition">بازگشت به خانه</a>
        </div>
      </div>
    `;
  }

  function buildDownloads() {
    const mount = document.getElementById("section-downloads");
    const { section, inner, header } = C.SectionShell({
      id: "downloads",
      badge: "منابع پروژه",
      title: "دانلود APK و دارایی‌های پیاده‌سازی",
      subtitle: "قبل از کدنویسی، نسخه مرجع بازی و پوشه تصاویر را در اختیار داشته باشید تا رفتار و داده‌ها با انتظار استاد هم‌خوان باشد.",
      parallaxClass: "bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)]",
    });
    inner.appendChild(header);

    const grid = C.el("div", "grid md:grid-cols-2 gap-6 mb-10");
    grid.appendChild(
      C.DownloadCard({
        icon: "fas fa-mobile-screen-button",
        title: "اپلیکیشن مرجع (APK)",
        description:
          "نسخه اندروید فاز اول را نصب کنید تا جریان نوبت، حرکت روی نقشه و حل نبرد را به‌صورت زنده ببینید. پیاده‌سازی C++ شما باید همین منطق را پوشش دهد.",
        href: "../releases/unmatched-phase1.apk",
        fileLabel: "releases/unmatched-phase1.apk",
        accent: "bg-emerald-500/20 text-emerald-400",
      })
    );
    grid.appendChild(
      C.DownloadCard({
        icon: "fas fa-folder-open",
        title: "بسته دارایی‌ها (Assets)",
        description:
          "تصاویر کارت‌ها، نقشه، مینیاتورها و آیکون‌های نوع حمله در ریشه پروژه قرار دارند. در صورت دریافت فایل فشرده از استاد، محتوا را در پوشه images استخراج کنید.",
        href: "../releases/unmatched-assets.zip",
        fileLabel: "releases/unmatched-assets.zip · یا پوشه images/",
        accent: "bg-indigo-500/20 text-indigo-400",
      })
    );
    inner.appendChild(grid);
    mount.appendChild(section);
  }

  function buildOverview() {
    const mount = document.getElementById("section-overview");
    const { section, inner, header } = C.SectionShell({
      id: "overview",
      badge: "مرور کلی",
      title: "بازی Unmatched چیست؟",
      subtitle: "دوئل کارتی با مینیاتور؛ هدف شما شکست قهرمان حریف است. فاز اول روی دو قهرمان و یک نقشه متمرکز است.",
      parallaxClass: "bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_60%)]",
    });
    inner.appendChild(header);

    const panel = C.el("div", "glass-panel rounded-2xl p-6 md:p-10 border border-white/10 space-y-6");
    panel.appendChild(
      C.el("p", "text-slate-300 leading-8 text-sm md:text-base", {
        text: "Unmatched یک بازی رومیزی نوبتی است. هر بازیکن یک قهرمان افسانه‌ای و یاران او را کنترل می‌کند. با ترکیب حرکت روی نقشه، بازی کارت و نبرد همزمان، سلامتی قهرمان حریف را به صفر می‌رسانید.",
      })
    );
    panel.appendChild(
      C.BulletList([
        "هر نوبت دقیقاً ۲ اقدام: مانور (Maneuver)، نقشه (Scheme) یا حمله (Attack).",
        "دست اولیه ۵ کارت؛ در پایان نوبت حداکثر ۷ کارت در دست مجاز است.",
        "مانور: یک کارت از دک بکشید (اجباری)، سپس حرکت اختیاری مبارزان تا سقف Move.",
        "فاز اول: شرلوک هلمز در برابر دراکولا روی نقشه Baskerville Manor.",
        "قلعه دراکولا در محدوده پیاده‌سازی الزامی نیست.",
      ])
    );
    const row = C.el("div", "flex flex-wrap gap-3 pt-2");
    row.appendChild(C.LinkButton({ href: `../index.html#how`, label: "نحوه بازی در سایت", variant: "outline" }));
    row.appendChild(C.LinkButton({ href: `${GAME}cardTypes.html`, label: "قوانین کامل کارت", variant: "solid" }));
    panel.appendChild(row);
    inner.appendChild(panel);
    mount.appendChild(section);
  }

  function buildHeroes() {
    const mount = document.getElementById("section-heroes");
    const { section, inner, header } = C.SectionShell({
      id: "heroes",
      badge: "مبارزها",
      title: "شرلوک و دراکولا",
      subtitle: "خلاصه توانایی‌ها برای شروع طراحی کلاس‌ها. جزئیات هر کارت و اثر روی صفحات اختصاصی است.",
      parallaxClass: "bg-[radial-gradient(ellipse_at_left,rgba(234,179,8,0.08),transparent_50%),radial-gradient(ellipse_at_right,rgba(220,38,38,0.08),transparent_50%)]",
    });
    inner.appendChild(header);

    const grid = C.el("div", "grid md:grid-cols-2 gap-8");
    grid.appendChild(
      C.HeroCard({
        name: "شرلوک هلمز",
        health: 16,
        move: 2,
        sidekick: "یار: دکتر واتسون (دورزن)",
        special: "افکت‌های اعمال‌شده روی کارت‌های هلمز و واتسون توسط حریف غیرفعال نمی‌شوند.",
        image: `${IMG}sherArt.png`,
        accent: "bg-gradient-to-t from-amber-500/20 to-transparent",
        href: `${GAME}sherlock.html`,
      })
    );
    grid.appendChild(
      C.HeroCard({
        name: "دراکولا",
        health: 13,
        move: 2,
        sidekick: "یاران: خواهران خون‌آشام ×۳ (نزدیک‌زن، ۱ سلامتی)",
        special: "تشنه خون: ابتدای نوبت خود ۱ ضربه به مبارز مجاور؛ در صورت موفقیت یک کارت بکشید.",
        image: `${IMG}DracArt.png`,
        accent: "bg-gradient-to-t from-red-600/25 to-transparent",
        href: `${GAME}dracula.html`,
      })
    );
    inner.appendChild(grid);
    mount.appendChild(section);
  }

  function buildMapCards() {
    const mount = document.getElementById("section-map-cards");
    const { section, inner, header } = C.SectionShell({
      id: "map-cards",
      badge: "میدان و کارت",
      title: "نقشه و قوانین کارت",
      subtitle: "سیستم گرید، منطقه‌ها و انواع کارت را در سطح overview بشناسید؛ پیاده‌سازی دقیق از مستندات تفصیلی پیروی کند.",
      parallaxClass: "bg-[radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.08),transparent_55%)]",
    });
    inner.appendChild(header);

    const grid = C.el("div", "grid lg:grid-cols-2 gap-6");
    grid.appendChild(
      C.TopicCard({
        icon: "fas fa-map",
        title: "نقشه Baskerville Manor",
        summary: "خانه‌ها با خط به هم متصل‌اند (مجاورت). رنگ‌ها Zone تعریف می‌کنند. گذرگاه مخفی یک واحد حرکت بین هر دو خانه علامت‌دار است.",
        points: [
          "هر خانه حداکثر یک مبارز؛ عبور از هم‌تیمی مجاز، توقف روی دشمن ممنوع.",
          "جایگذاری: بازیکن جوان‌تر Space 1، مسن‌تر Space 2؛ یاران در Zone قهرمان.",
          "Boost: دور انداختن کارت از دست برای افزودن مقدار Boost به حرکت در مانور.",
        ],
        href: `${GAME}map.html`,
        hrefLabel: "جزئیات نقشه و حرکت",
      })
    );
    grid.appendChild(
      C.TopicCard({
        icon: "fas fa-clone",
        title: "انواع و زمان‌بندی کارت",
        summary: "چهار نوع اصلی: حمله، دفاع، چندمنظوره (Versatile)، نقشه (Scheme). مالکیت کارت: Hero، Sidekick یا Any.",
        points: [
          "حمله و دفاع فقط در اکشن Attack؛ Scheme در اکشن جدا بازی می‌شود.",
          "زمان اثر در نبرد: Immediately → During Combat → آسیب → After Combat.",
          "کارت شخصیت شکست‌خورده برای اکشن بازی نمی‌شود؛ برای Boost قابل دور انداختن است.",
        ],
        href: `${GAME}cardTypes.html`,
        hrefLabel: "راهنمای کامل انواع کارت",
      })
    );
    inner.appendChild(grid);
    mount.appendChild(section);
  }

  function buildCombat() {
    const mount = document.getElementById("section-combat");
    const { section, inner, header } = C.SectionShell({
      id: "combat",
      badge: "نبرد",
      title: "حل نبرد (Combat)",
      subtitle: "جریان حمله از انتخاب هدف تا محاسبه آسیب — نسخه خلاصه برای طراحی ماژول Combat در C++.",
      parallaxClass: "bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1),transparent_50%)]",
    });
    inner.appendChild(header);

    const layout = C.el("div", "grid lg:grid-cols-5 gap-8 items-start");
    const steps = C.el("div", "lg:col-span-3 glass-panel rounded-2xl p-6 md:p-8 border border-white/10 space-y-4");
    const stepData = [
      ["۱", "اعلام مبارز فعال و هدف معتبر", "نزدیک‌زن: مجاور · دورزن: مجاور یا همان Zone"],
      ["۲", "انتخاب کارت", "مهاجم: Attack/Versatile · مدافع: Defense/Versatile (اختیاری) · رو کردن همزمان"],
      ["۳", "حل اثرات", "ابتدا مدافع، سپس مهاجم · Immediately و During Combat"],
      ["۴", "آسیب", "max(0, Attack − Defense) · اگر Attack ≤ Defense آسیب صفر است"],
      ["۵", "پایان", "After Combat · کارت‌ها به discard · شکست Hero = پایان بازی"],
    ];
    stepData.forEach(([num, title, desc]) => {
      const row = C.el("div", "flex gap-4 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0");
      row.appendChild(C.el("span", "w-9 h-9 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center font-black text-sm shrink-0", { text: num }));
      const body = C.el("div", "space-y-1");
      body.appendChild(C.el("h4", "font-bold text-white text-sm", { text: title }));
      body.appendChild(C.el("p", "text-slate-400 text-xs leading-6", { text: desc }));
      row.appendChild(body);
      steps.appendChild(row);
    });

    const aside = C.el("div", "lg:col-span-2 space-y-4");
    const formula = C.el("div", "rounded-2xl bg-gradient-to-br from-red-950/80 to-[#161a22] border border-red-500/30 p-6 text-center");
    formula.innerHTML = `
      <p class="text-xs text-red-300/80 mb-2 font-bold uppercase tracking-wider">فرمول پایه</p>
      <p class="text-2xl font-black text-white font-mono dir-ltr">damage = max(0, ATK − DEF)</p>
      <p class="text-slate-400 text-xs mt-4 leading-6">شبیه‌ساز تعاملی و مثال‌های بیشتر در صفحه نبرد.</p>
    `;
    aside.appendChild(formula);
    aside.appendChild(C.LinkButton({ href: `${GAME}combat.html`, label: "راهنمای کامل نبرد", variant: "solid" }));

    layout.appendChild(steps);
    layout.appendChild(aside);
    inner.appendChild(layout);
    mount.appendChild(section);
  }

  function buildDelivery() {
    const mount = document.getElementById("section-delivery");
    const { section, inner, header } = C.SectionShell({
      id: "delivery",
      badge: "تحویل",
      title: "نکات پایانی پروژه",
      subtitle: "خلاصه الزامات نمره‌دهی. فهرست کامل، هشدارها و جزئیات در صفحه نکات حیاتی قرار دارد.",
      parallaxClass: "bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_60%)]",
    });
    inner.appendChild(header);

    const grid = C.el("div", "grid sm:grid-cols-2 gap-4 mb-8");
    const notes = [
      { icon: "fas fa-cubes", title: "اصول OOP", text: "کپسوله‌سازی، انتزاع، وراثت و چندریختی در طراحی کلاس‌ها." },
      { icon: "fas fa-puzzle-piece", title: "ماژولار بودن", text: "جداسازی نقشه، دسته کارت، نوبت و نبرد برای نگهداری آسان." },
      { icon: "fas fa-ban", title: "بدون Global", text: "هیچ متغیر سراسری در پیاده‌سازی نهایی مجاز نیست." },
      { icon: "fas fa-code-branch", title: "Git و CMake", text: "ساخت پروژه و تاریخچه commit بخش ارزیابی است." },
      { icon: "fas fa-triangle-exclamation", title: "Exception Handling", text: "خطاهای ورودی و وضعیت نامعتبر بازی مدیریت شوند." },
      { icon: "fas fa-file-pdf", title: "گزارش PDF", text: "تحویل کد همراه گزارش مستند الزامی است." },
    ];
    notes.forEach((n) => grid.appendChild(C.NoteCard(n)));
    inner.appendChild(grid);

    const warn = C.el("div", "rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between");
    warn.appendChild(
      C.el("p", "text-rose-200 text-sm leading-7 flex-1", {
        text: "الگوهای طراحی اجباری نیستند اما پیاده‌سازی صحیح کیفیت را بالا می‌برد. نسخه کامل الزامات، Design Patterns و هشدار تقلب در صفحه نکات حیاتی آمده است.",
      })
    );
    warn.appendChild(C.LinkButton({ href: `${GAME}points.html`, label: "مشاهده نکات حیاتی کامل", variant: "solid" }));
    inner.appendChild(warn);
    mount.appendChild(section);
  }

  function initTheme() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const update = () => {
      btn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
    };
    btn.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      update();
    });
    if (localStorage.theme === "light") document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
    update();
  }

  function initMenu() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("roadmap-nav");
    const backdrop = document.getElementById("nav-backdrop");
    if (!toggle || !nav) return;
    const setOpen = (open) => {
      nav.classList.toggle("nav-open", open);
      if (backdrop) backdrop.classList.toggle("hidden", !open);
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("nav-open")));
    if (backdrop) backdrop.addEventListener("click", () => setOpen(false));
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildNav();
    buildHero();
    buildDownloads();
    buildOverview();
    buildHeroes();
    buildMapCards();
    buildCombat();
    buildDelivery();
    initTheme();
    initMenu();
    new window.RoadmapParallax().init();
  });
})();
