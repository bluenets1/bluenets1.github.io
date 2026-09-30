(() => {
  "use strict";

  const S = window.SITE;
  const $ = (sel, el = document) => el.querySelector(sel);
  const view = $("#view");

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  // escape, then render **bold** spans
  const mdBold = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const findSection = (s) => S.sections.find((x) => x.slug === s);
  const findTopic = (sec, t) => sec && sec.topics.find((x) => x.slug === t);
  const findPost = (top, p) => top && top.posts.find((x) => x.slug === p);
  const sortPosts = (posts) => [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const allPosts = () =>
    S.sections
      .filter((sec) => sec.topics)
      .flatMap((sec) => sec.topics.flatMap((t) => t.posts.map((p) => ({ ...p, sec, t }))))
      .sort((a, b) => (a.date < b.date ? 1 : -1));

  /* ------------------------------------------------------------------ chrome */

  const ICONS = {
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>',
    x:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.3l-7.2 8.24 8.48 11.26h-6.64l-5.2-6.82-5.96 6.82H1.72l7.7-8.82L1.28 2.25h6.8l4.7 6.22 5.46-6.22zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none"/></svg>',
    rss:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="19" r="2"/><path d="M3 10a11 11 0 0 1 11 11h-3A8 8 0 0 0 3 13z"/><path d="M3 4a17 17 0 0 1 17 17h-3A14 14 0 0 0 3 7z"/></svg>'
  };

  function renderChrome() {
    $("#site-sub").textContent = S.roles.join(" · ");
    $("#year").textContent = new Date().getFullYear();
    const socials = S.socials
      .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener me" title="${esc(s.label)}" aria-label="${esc(s.label)}">${ICONS[s.label.toLowerCase()] || esc(s.label)}</a>`)
      .join("");
    $("#socials").innerHTML =
      `<a class="rss" href="feed.xml" title="RSS feed">${ICONS.rss}<span>RSS</span></a>` + socials;
  }

  function renderNav(active) {
    $("#tabs").innerHTML = [{ slug: "", title: "about" }, ...S.sections]
      .map((it) => `<li><a href="#/${it.slug}" class="${(active || "") === it.slug ? "on" : ""}">${esc(it.title)}</a></li>`)
      .join("");
  }

  function renderSidebar() {
    const recent = recentAll().slice(0, 7);
    $("#sidebar").innerHTML = `
      <div class="sidebar-box">
        <h2 class="sidebar-title">Recent Writing</h2>
        <ul class="sidebar-list">
          ${recent
            .map(
              (p) => `<li><a href="${p.href}">${esc(p.title)}</a>
                <span class="s-meta">${esc(p.section)} · ${esc(p.date)}</span></li>`
            )
            .join("")}
        </ul>
      </div>`;
  }

  // unified recent list: static posts + imported cyber notes, newest first
  function recentAll() {
    const statics = allPosts().map((p) => ({
      title: p.title, date: p.date, section: p.sec.title,
      href: `#/${p.sec.slug}/${p.t.slug}/${p.slug}`
    }));
    return [...statics, ...cyberFlat()].sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function setSidebar(on) {
    $("#grid").classList.toggle("with-sidebar", on);
  }

  // make the square avatar exactly as tall as the intro text beside it
  function fitAvatar() {
    const av = $(".avatar"), intro = $(".about-head .intro");
    if (!av || !intro) return;
    if (matchMedia("(max-width: 560px)").matches) { av.style.width = ""; av.style.height = ""; return; }
    for (let i = 0; i < 3; i++) {       // converges: set square = text height, remeasure
      const h = Math.round(intro.offsetHeight);
      av.style.width = h + "px";
      av.style.height = h + "px";
    }
  }
  addEventListener("resize", () => { if ($(".about-head")) fitAvatar(); });

  /* ------------------------------------------------------------------ views */

  function aboutView() {
    setSidebar(false);
    const intro = (S.intro && S.intro.length)
      ? `<ul class="intro">${S.intro.map((l) => `<li>${mdBold(l)}</li>`).join("")}</ul>`
      : `<p class="bio">${esc(S.bio)}</p>`;
    view.innerHTML = `
      <div class="about-head">
        <img class="avatar" src="${esc(S.avatar)}" alt="${esc(S.name)}">
        ${intro}
      </div>

      <h2 class="h-section">Experience</h2>
      <ol class="timeline">
        ${S.experience.map(expItem).join("")}
      </ol>`;
    fitAvatar();
    document.title = S.name;
  }

  function expItem(e) {
    const headline = e.role || e.company;
    const orgBits = [e.role ? e.company : null, e.kind].filter(Boolean).join(" · ");
    const companyEl = e.url
      ? `<a href="${esc(e.url)}" target="_blank" rel="noopener" class="tl-headline">${esc(headline)}</a>`
      : `<div class="tl-headline">${esc(headline)}</div>`;
    return `
      <li>
        ${
          e.logo
            ? `<img class="tl-dot${e.fit === "contain" ? " contain" : ""}" src="${esc(e.logo)}" alt="${esc(e.company)}">`
            : `<span class="tl-dot logo-fallback">${esc(initials(e.company))}</span>`
        }
        <div class="tl-body">
          ${companyEl}
          ${orgBits ? `<div class="tl-org">${esc(orgBits)}</div>` : ""}
          ${!e.positions && e.period ? `<div class="tl-period">${esc(e.period)}</div>` : ""}
          ${e.location ? `<div class="tl-loc">${esc(e.location)}</div>` : ""}
          ${
            e.positions
              ? `<ul class="tl-positions">${e.positions
                  .map((p) => `<li><span class="tl-pos-title">${esc(p.title)}</span><span class="tl-period">${esc(p.period)}</span></li>`)
                  .join("")}</ul>`
              : ""
          }
          ${e.points ? `<ul class="tl-points">${e.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` : ""}
          ${e.skills ? `<div class="tl-skills">${esc(e.skills)}</div>` : ""}
        </div>
      </li>`;
  }

  function crumbs(parts) {
    // parts: array of {label, href?} ; last has no href
    return `<nav class="crumbs">${parts
      .map((p, i) => (p.href ? `<a href="${p.href}">${esc(p.label)}</a>` : `<span>${esc(p.label)}</span>`) + (i < parts.length - 1 ? '<span class="sep">/</span>' : ""))
      .join("")}</nav>`;
  }

  function sectionView(sec) {
    setSidebar(false);
    view.innerHTML = `
      ${crumbs([{ label: "home", href: "#/" }, { label: sec.title }])}
      <div class="page-head">
        <h1>${esc(sec.title)}</h1>
        ${sec.desc ? `<p>${esc(sec.desc)}</p>` : ""}
      </div>
      <ul class="cards">
        ${sec.topics
          .map(
            (t) => `<li><a class="card" href="#/${sec.slug}/${t.slug}">
              <div class="card-title">${esc(t.title)}</div>
              ${t.desc ? `<div class="card-desc">${esc(t.desc)}</div>` : ""}
              <div class="card-meta">${t.posts.length} ${sec.video ? "video" : "post"}${t.posts.length === 1 ? "" : "s"}</div>
            </a></li>`
          )
          .join("")}
      </ul>`;
    document.title = `${sec.title} · ${S.name}`;
  }

  function topicView(sec, top) {
    setSidebar(false);
    view.innerHTML = `
      ${crumbs([{ label: "home", href: "#/" }, { label: sec.title, href: `#/${sec.slug}` }, { label: top.title }])}
      <div class="page-head">
        <h1>${esc(top.title)}</h1>
        ${top.desc ? `<p>${esc(top.desc)}</p>` : ""}
      </div>
      <ul class="posts">
        ${sortPosts(top.posts)
          .map(
            (p) => `<li><a href="#/${sec.slug}/${top.slug}/${p.slug}">
              <span class="post-name">${esc(p.title)}</span>
              <span class="post-line"><span class="post-date">${esc(p.date)}</span><span class="post-tags">${(p.tags || []).map((t) => "#" + esc(t)).join(" ")}</span></span>
            </a></li>`
          )
          .join("") || `<li class="empty">Nothing here yet.</li>`}
      </ul>`;
    document.title = `${top.title} · ${S.name}`;
  }

  async function postView(sec, top, post) {
    setSidebar(false);
    const path = `content/${sec.slug}/${top.slug}/${post.slug}.md`;
    document.title = `${post.title} · ${S.name}`;
    view.innerHTML = `<p class="dim">Loading…</p>`;

    let md;
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      md = await res.text();
    } catch (e) {
      view.innerHTML = `<div class="notfound"><h1>Couldn't load this post</h1>
        <p>If you opened <code>index.html</code> straight from disk, serve the folder instead:<br><code>python3 -m http.server</code></p>
        <p><a href="#/${sec.slug}/${top.slug}">Back to ${esc(top.title)}</a></p></div>`;
      return;
    }

    md = md.replace(/^\s*# .*\n/, "");
    const words = md.split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 220));

    const ordered = sortPosts(top.posts);
    const i = ordered.indexOf(post);
    const newer = ordered[i - 1], older = ordered[i + 1];

    const video =
      sec.video &&
      (post.youtube
        ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(post.youtube)}" title="${esc(post.title)}" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
        : `<div class="video video-empty">[ add a youtube id for this note in content/site.js ]</div>`);

    view.innerHTML = `
      <article class="post">
        ${crumbs([{ label: "home", href: "#/" }, { label: sec.title, href: `#/${sec.slug}` }, { label: top.title, href: `#/${sec.slug}/${top.slug}` }, { label: post.title }])}
        <h1 class="post-title">${esc(post.title)}</h1>
        <p class="post-meta">
          <span>${esc(post.date)}</span>
          <span>${mins} min read</span>
          ${(post.tags || []).map((t) => `<span class="tag">#${esc(t)}</span>`).join("")}
        </p>
        ${video || ""}
        <div class="toc-slot"></div>
        <div class="prose">${marked.parse(md)}</div>
        <nav class="pager">
          ${older ? `<a href="#/${sec.slug}/${top.slug}/${older.slug}"><span class="lbl">Previous</span><span class="ttl">${esc(older.title)}</span></a>` : "<span></span>"}
          ${newer ? `<a class="next" href="#/${sec.slug}/${top.slug}/${newer.slug}"><span class="lbl">Next</span><span class="ttl">${esc(newer.title)}</span></a>` : "<span></span>"}
        </nav>
      </article>`;

    enhancePost($(".post"));
  }

  function notFound(msg) {
    setSidebar(false);
    view.innerHTML = `<div class="notfound"><h1>${msg ? "Can't show this" : "Page not found"}</h1><p>${msg ? esc(msg) : "That page doesn't exist."} <a href="#/">Go home</a>.</p></div>`;
    document.title = `Not found · ${S.name}`;
  }

  /* ------------------------------------------------------------------ markdown */

  function splitLines(html) {
    const lines = [];
    const open = [];
    let cur = "";
    const re = /(<span[^>]*>)|(<\/span>)|(\n)|([^<\n]+|<)/g;
    let m;
    while ((m = re.exec(html))) {
      if (m[1]) { open.push(m[1]); cur += m[1]; }
      else if (m[2]) { open.pop(); cur += m[2]; }
      else if (m[3]) { cur += "</span>".repeat(open.length); lines.push(cur); cur = open.join(""); }
      else cur += m[4];
    }
    lines.push(cur);
    if (lines.length > 1 && lines[lines.length - 1].replace(/<[^>]+>/g, "") === "") lines.pop();
    return lines;
  }

  function parseMarks(s) {
    const set = new Set();
    if (!s) return set;
    for (const part of s.split(",")) {
      const [a, b] = part.split("-").map(Number);
      for (let n = a; n <= (b || a); n++) set.add(n);
    }
    return set;
  }

  const renderer = new marked.Renderer();

  renderer.code = function (code, info) {
    info = (info || "").trim();
    const lang = (info.match(/^[^\s{]+/) || [""])[0].toLowerCase();
    const title = (info.match(/title=("([^"]+)"|\S+)/) || [])[2] || (info.match(/title=(\S+)/) || [])[1];
    const marks = parseMarks((info.match(/\{([\d,\-\s]+)\}/) || [])[1]);

    const known = lang && hljs.getLanguage(lang);
    const html = known ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value : esc(code);
    const body = marks.size
      ? splitLines(html).map((l, i) => `<span class="line${marks.has(i + 1) ? " mark" : ""}">${l || " "}</span>`).join("")
      : html;

    return `<figure class="code">
      <figcaption>
        <span class="lang">${esc(title || lang || "text")}</span>
        ${title && lang ? `<span class="dim">${esc(lang)}</span>` : ""}
        <button class="copy" type="button">copy</button>
      </figcaption>
      <pre><code class="hljs${lang ? " language-" + esc(lang) : ""}">${body}</code></pre>
      <textarea hidden>${esc(code)}</textarea>
    </figure>`;
  };

  renderer.blockquote = function (quote) {
    const m = quote.match(/^\s*<p>\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/i);
    if (!m) return `<blockquote>${quote}</blockquote>`;
    const kind = m[1].toLowerCase();
    return `<blockquote class="callout ${kind}"><div class="callout-title">${kind}</div><p>${quote.slice(m[0].length)}</blockquote>`;
  };

  renderer.link = function (href, title, text) {
    const ext = /^https?:\/\//.test(href);
    return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ""}${ext ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  };

  marked.use({ renderer, gfm: true });

  function enhancePost(root) {
    const heads = [...root.querySelectorAll(".prose h2, .prose h3")];
    const used = {};
    heads.forEach((h) => {
      let id = slugify(h.textContent);
      if (used[id]) id += "-" + ++used[id]; else used[id] = 1;
      h.id = id;
      const a = document.createElement("a");
      a.className = "anchor";
      a.textContent = "#";
      a.href = "javascript:void 0";
      a.onclick = () => h.scrollIntoView({ behavior: "smooth" });
      h.prepend(a);
    });

    if (heads.length >= 3) {
      const toc = document.createElement("details");
      toc.className = "toc";
      toc.innerHTML = `<summary>Contents</summary><ol>${heads
        .map((h) => `<li class="${h.tagName.toLowerCase()}"><a href="javascript:void 0" data-to="${h.id}">${esc(h.textContent.replace(/^#/, ""))}</a></li>`)
        .join("")}</ol>`;
      toc.addEventListener("click", (e) => {
        const to = e.target.dataset.to;
        if (to) document.getElementById(to).scrollIntoView({ behavior: "smooth" });
      });
      $(".toc-slot", root).replaceWith(toc);
    }

    root.querySelectorAll("figure.code .copy").forEach((btn) => {
      btn.onclick = async () => {
        const src = btn.closest("figure").querySelector("textarea").value;
        try {
          await navigator.clipboard.writeText(src);
          btn.textContent = "copied";
        } catch {
          btn.textContent = "failed";
        }
        setTimeout(() => (btn.textContent = "copy"), 1400);
      };
    });

    root.querySelectorAll(".prose img").forEach((img) => (img.loading = "lazy"));
  }

  /* ------------------------------------------------------------ cyber tree */

  let CYBER = null;        // manifest tree, or null until loaded
  let CYBER_ERR = false;

  async function loadCyber() {
    try {
      const res = await fetch("content/cyber-index.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      CYBER = await res.json();
    } catch (e) {
      CYBER_ERR = true;
    }
  }

  // flatten every note with its hash link + dir path, newest first
  function cyberFlat() {
    if (!CYBER) return [];
    const out = [];
    const walk = (node, slugs, names) => {
      (node.notes || []).forEach((n) =>
        out.push({
          title: n.name, date: n.date, section: "cybersecurity",
          path: [...names, n.name].join(" / "),
          href: "#/cybersecurity/" + [...slugs, n.slug].map(encodeURIComponent).join("/")
        })
      );
      (node.dirs || []).forEach((d) => walk(d, [...slugs, d.slug], [...names, d.name]));
    };
    walk(CYBER, [], []);
    return out.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  // resolve a slug path within the tree -> { kind, node|note, trail }
  function cyberResolve(slugs) {
    if (!CYBER) return null;
    let node = CYBER;
    const trail = [{ label: "cybersecurity", slug: "", href: "#/cybersecurity" }];
    for (let i = 0; i < slugs.length; i++) {
      const sl = slugs[i];
      const dir = (node.dirs || []).find((d) => d.slug === sl);
      if (dir) {
        trail.push({ label: dir.name, href: "#/cybersecurity/" + slugs.slice(0, i + 1).map(encodeURIComponent).join("/") });
        node = dir;
        continue;
      }
      const note = (node.notes || []).find((n) => n.slug === sl);
      if (note && i === slugs.length - 1) {
        trail.push({ label: note.name });
        return { kind: "note", note, parent: node, trail };
      }
      return null;
    }
    return { kind: "dir", node, trail };
  }

  function cyberRoot(sec) {
    if (CYBER_ERR)
      return notFound("Couldn't load the notes index. Serve the folder with a web server (e.g. python3 -m http.server).");
    if (!CYBER) { view.innerHTML = `<p class="dim">Loading notes…</p>`; return; }
    setSidebar(false);
    view.innerHTML = `
      ${crumbs([{ label: "home", href: "#/" }, { label: sec.title }])}
      <div class="page-head"><h1>${esc(sec.title)}</h1>${sec.desc ? `<p>${esc(sec.desc)}</p>` : ""}</div>
      ${cyberListing(CYBER, [])}`;
    document.title = `${sec.title} · ${S.name}`;
  }

  function cyberListing(node, slugs) {
    const base = "#/cybersecurity" + (slugs.length ? "/" + slugs.map(encodeURIComponent).join("/") : "");
    const dirs = (node.dirs || [])
      .map((d) => {
        const n = countNotes(d);
        return `<li><a class="card" href="${base}/${encodeURIComponent(d.slug)}">
          <div class="card-title">${esc(d.name)}</div>
          <div class="card-meta">${n} note${n === 1 ? "" : "s"}</div></a></li>`;
      })
      .join("");
    const notes = (node.notes || [])
      .map(
        (nt) => `<li><a href="${base}/${encodeURIComponent(nt.slug)}">
          <span class="post-name">${esc(nt.name)}</span>
          <span class="post-line"><span class="post-date">${esc(nt.date)}</span></span></a></li>`
      )
      .join("");
    return (
      (dirs ? `<ul class="cards">${dirs}</ul>` : "") +
      (notes ? `<ul class="posts"${dirs ? ' style="margin-top:20px"' : ""}>${notes}</ul>` : "") ||
      `<p class="empty">Nothing here.</p>`
    );
  }

  function countNotes(node) {
    let c = (node.notes || []).length;
    (node.dirs || []).forEach((d) => (c += countNotes(d)));
    return c;
  }

  function cyberDirView(r, slugs) {
    setSidebar(false);
    const t = r.trail;
    view.innerHTML = `
      ${crumbs([{ label: "home", href: "#/" }, ...t.map((x, i) => (i === t.length - 1 ? { label: x.label } : { label: x.label, href: x.href }))])}
      <div class="page-head"><h1>${esc(r.node.name)}</h1></div>
      ${cyberListing(r.node, slugs)}`;
    document.title = `${r.node.name} · ${S.name}`;
  }

  async function cyberNoteView(r, slugs) {
    setSidebar(false);
    const note = r.note;
    document.title = `${note.name} · ${S.name}`;
    view.innerHTML = `<p class="dim">Loading…</p>`;

    let md;
    try {
      const res = await fetch(note.file, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      md = await res.text();
    } catch (e) {
      view.innerHTML = `<div class="notfound"><h1>Couldn't load this note</h1><p><a href="#/cybersecurity">Back to cybersecurity</a></p></div>`;
      return;
    }
    md = md.replace(/^\s*# .*\n/, "");

    const siblings = r.parent.notes || [];
    const i = siblings.findIndex((n) => n.slug === note.slug);
    const parentBase = "#/cybersecurity/" + slugs.slice(0, -1).map(encodeURIComponent).join("/");
    const prev = siblings[i - 1], next = siblings[i + 1];
    const t = r.trail;

    view.innerHTML = `
      <article class="post">
        ${crumbs([{ label: "home", href: "#/" }, ...t.map((x, idx) => (idx === t.length - 1 ? { label: x.label } : { label: x.label, href: x.href }))])}
        <h1 class="post-title">${esc(note.name)}</h1>
        <p class="post-meta"><span>${esc(note.date)}</span></p>
        <div class="toc-slot"></div>
        <div class="prose">${marked.parse(md)}</div>
        <nav class="pager">
          ${prev ? `<a href="${parentBase}/${encodeURIComponent(prev.slug)}"><span class="lbl">Previous</span><span class="ttl">${esc(prev.name)}</span></a>` : "<span></span>"}
          ${next ? `<a class="next" href="${parentBase}/${encodeURIComponent(next.slug)}"><span class="lbl">Next</span><span class="ttl">${esc(next.name)}</span></a>` : "<span></span>"}
        </nav>
      </article>`;
    enhancePost($(".post"));
  }

  function cyberRoute(sec, slugs) {
    if (!slugs.length) return cyberRoot(sec);
    if (CYBER_ERR) return cyberRoot(sec);
    if (!CYBER) { view.innerHTML = `<p class="dim">Loading notes…</p>`; return; }
    const r = cyberResolve(slugs);
    if (!r) return notFound();
    return r.kind === "note" ? cyberNoteView(r, slugs) : cyberDirView(r, slugs);
  }

  /* ------------------------------------------------------------------ router */

  function route() {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, "")).replace(/\/$/, "");
    const parts = raw ? raw.split("/") : [];
    const [s, t, p, extra] = parts;
    scrollTo(0, 0);
    renderNav(s || "");

    if (!s || s === "about") return aboutView();
    const sec = findSection(s);
    if (!sec) return notFound();
    if (sec.dynamic) return cyberRoute(sec, parts.slice(1));
    if (extra) return notFound();
    if (!t) return sectionView(sec);
    const top = findTopic(sec, t);
    if (!top) return notFound();
    if (!p) return topicView(sec, top);
    const post = findPost(top, p);
    if (!post) return notFound();
    return postView(sec, top, post);
  }

  addEventListener("hashchange", route);
  renderChrome();
  loadCyber().finally(route);
})();
