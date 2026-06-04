(function (global) {
  function el(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === "html") node.innerHTML = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value);
      });
    }
    return node;
  }

  function SectionShell({ id, badge, title, subtitle, parallaxClass, parallaxSpeed }) {
    const section = el("section", "roadmap-section relative py-24 md:py-32 overflow-hidden scroll-mt-24", {
      id,
      "data-section": id,
    });

    const blobA = el(
      "div",
      `parallax-layer absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[100px] opacity-60 pointer-events-none ${parallaxClass || "bg-indigo-600/20"}`,
      { "data-section-parallax": String(parallaxSpeed || 0.55) }
    );
    const blobB = el(
      "div",
      "parallax-layer absolute -bottom-32 -right-16 w-[360px] h-[360px] rounded-full blur-[90px] opacity-40 pointer-events-none bg-purple-600/15",
      { "data-section-parallax": String((parallaxSpeed || 0.55) * 0.65) }
    );
    const blobC = el(
      "div",
      "parallax-layer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full blur-[120px] opacity-25 pointer-events-none bg-cyan-500/10",
      { "data-section-parallax": String((parallaxSpeed || 0.55) * 0.35) }
    );

    const glow = el("div", "absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0f1115]/70 to-[#0f1115] pointer-events-none");
    const inner = el("div", "relative z-10 max-w-6xl mx-auto px-5 md:px-8");
    const header = el("header", "mb-12 md:mb-16 text-center md:text-right", { "data-parallax-content": "0.22" });
    if (badge) {
      header.appendChild(
        el("span", "inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30", {
          text: badge,
        })
      );
    }
    header.appendChild(el("h2", "text-3xl md:text-4xl font-black text-white mb-3", { text: title }));
    if (subtitle) {
      header.appendChild(el("p", "text-slate-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0 md:mr-0 leading-relaxed", { text: subtitle }));
    }
    section.appendChild(blobA);
    section.appendChild(blobB);
    section.appendChild(blobC);
    section.appendChild(glow);
    section.appendChild(inner);
    return { section, inner, header };
  }

  function LinkButton({ href, label, variant }) {
    const base =
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition transform hover:-translate-y-0.5";
    const styles =
      variant === "outline"
        ? `${base} border border-indigo-500/50 text-indigo-200 hover:bg-indigo-500/20`
        : `${base} bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40`;
    return el("a", styles, { href, html: `${label} <i class="fas fa-arrow-left text-xs"></i>` });
  }

  function DownloadCard({ icon, title, description, href, fileLabel, accent }) {
    const card = el(
      "article",
      "glass-panel rounded-2xl p-6 md:p-8 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
    );
    const row = el("div", "flex flex-col md:flex-row md:items-center gap-6");
    const iconWrap = el(
      "div",
      `w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl ${accent}`
    );
    iconWrap.innerHTML = `<i class="${icon}"></i>`;
    const body = el("div", "flex-1 space-y-3");
    body.appendChild(el("h3", "text-xl font-bold text-white", { text: title }));
    body.appendChild(el("p", "text-slate-400 text-sm leading-7", { text: description }));
    if (fileLabel) {
      body.appendChild(el("p", "text-xs text-slate-500 font-mono dir-ltr text-left", { text: fileLabel }));
    }
    const actions = el("div", "flex flex-wrap gap-3 shrink-0");
    actions.appendChild(
      el("a", "inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg", {
        href,
        download: "",
        html: '<i class="fas fa-download"></i> دانلود',
      })
    );
    row.appendChild(iconWrap);
    row.appendChild(body);
    row.appendChild(actions);
    card.appendChild(row);
    return card;
  }

  function BulletList(items) {
    const ul = el("ul", "space-y-3");
    items.forEach((item) => {
      const li = el("li", "flex items-start gap-3 text-slate-300 text-sm leading-7");
      li.innerHTML = `<span class="mt-1.5 w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span><span>${item}</span>`;
      ul.appendChild(li);
    });
    return ul;
  }

  function AssetGrid(items) {
    const grid = el("div", "grid sm:grid-cols-2 lg:grid-cols-3 gap-4");
    items.forEach((item) => {
      const card = el("div", "rounded-xl bg-[#161a22] border border-[#2a2f3a] p-4 hover:border-indigo-500/40 transition");
      card.appendChild(el("h4", "font-bold text-white text-sm mb-2", { text: item.title }));
      card.appendChild(el("p", "text-slate-500 text-xs font-mono dir-ltr break-all", { text: item.path }));
      if (item.note) card.appendChild(el("p", "text-slate-400 text-xs mt-2 leading-6", { text: item.note }));
      grid.appendChild(card);
    });
    return grid;
  }

  function HeroCard({ name, health, move, special, sidekick, image, accent, href, index }) {
    const card = el(
      "article",
      `hero-card group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12151c] hover:border-opacity-60 transition-all duration-500`,
      { "data-parallax-content": String(0.08 + (index || 0) * 0.06) }
    );
    const imgWrap = el("div", "relative h-56 overflow-hidden");
    const img = el("img", "w-full h-full object-cover transition duration-700 group-hover:scale-105", {
      src: image,
      alt: name,
      loading: "lazy",
    });
    const overlay = el(
      "div",
      `absolute inset-0 bg-gradient-to-t from-[#12151c] via-transparent to-transparent opacity-90`
    );
    const accentGlow = el("div", `absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 ${accent}`);
    imgWrap.appendChild(img);
    imgWrap.appendChild(overlay);
    imgWrap.appendChild(accentGlow);
    const body = el("div", "p-6 space-y-4");
    body.appendChild(el("h3", "text-2xl font-black text-white", { text: name }));
    body.appendChild(
      el("p", "text-sm text-slate-400", {
        text: `سلامتی ${health} · حرکت ${move}`,
      })
    );
    if (sidekick) body.appendChild(el("p", "text-sm text-indigo-300/90", { text: sidekick }));
    body.appendChild(el("p", "text-sm text-slate-300 leading-7", { text: special }));
    body.appendChild(LinkButton({ href, label: "صفحه اختصاصی مبارز", variant: "solid" }));
    card.appendChild(imgWrap);
    card.appendChild(body);
    return card;
  }

  function TopicCard({ icon, title, summary, points, href, hrefLabel, index }) {
    const card = el("div", "glass-panel rounded-2xl p-6 md:p-8 border border-white/10 space-y-5", {
      "data-parallax-content": String(0.1 + (index || 0) * 0.07),
    });
    const head = el("div", "flex items-center gap-4");
    const iconBox = el("div", "w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl");
    iconBox.innerHTML = `<i class="${icon}"></i>`;
    head.appendChild(iconBox);
    head.appendChild(el("h3", "text-xl font-bold text-white", { text: title }));
    card.appendChild(head);
    card.appendChild(el("p", "text-slate-400 text-sm leading-7", { text: summary }));
    if (points && points.length) card.appendChild(BulletList(points));
    if (href) card.appendChild(LinkButton({ href, label: hrefLabel, variant: "outline" }));
    return card;
  }

  function NoteCard({ icon, title, text }) {
    const card = el("div", "rounded-xl bg-[#161a22] border border-[#2a2f3a] p-5 flex gap-4");
    const iconWrap = el("div", "w-10 h-10 rounded-lg bg-indigo-500/15 text-indigo-300 flex items-center justify-center shrink-0");
    iconWrap.innerHTML = `<i class="${icon}"></i>`;
    const body = el("div", "space-y-1");
    body.appendChild(el("h4", "font-bold text-white text-sm", { text: title }));
    body.appendChild(el("p", "text-slate-400 text-xs leading-6", { text: text }));
    card.appendChild(iconWrap);
    card.appendChild(body);
    return card;
  }

  function ProgressStep({ number, label, active }) {
    const step = el("a", "roadmap-nav-step group flex items-center gap-3 py-2 px-3 rounded-lg transition", {
      href: `#${label.id}`,
      "data-nav": label.id,
    });
    const num = el(
      "span",
      `w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
        active ? "bg-indigo-500 text-white" : "bg-[#222] text-slate-400 group-hover:bg-indigo-500/30"
      }`,
      { text: String(number) }
    );
    step.appendChild(num);
    step.appendChild(el("span", "text-sm text-slate-400 group-hover:text-white transition", { text: label.title }));
    return step;
  }

  global.RoadmapComponents = {
    el,
    SectionShell,
    LinkButton,
    DownloadCard,
    BulletList,
    AssetGrid,
    HeroCard,
    TopicCard,
    NoteCard,
    ProgressStep,
  };
})(window);
