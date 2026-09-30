#!/usr/bin/env node
/*
 * Generate feed.xml (RSS 2.0) from the static posts in content/site.js and the
 * imported cyber notes in content/cyber-index.json.
 *
 *   node tools/gen_feed.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.dirname(__dirname);
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// load SITE from content/site.js
const sandbox = { window: {} };
vm.runInNewContext(read("content/site.js"), sandbox);
const SITE = sandbox.window.SITE;
const BASE = (SITE.url || "").replace(/\/$/, "");

const esc = (s = "") =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function summary(mdPath) {
  try {
    let md = read(mdPath);
    md = md.replace(/^﻿?---\n[\s\S]*?\n---\n/, "");      // frontmatter
    for (let line of md.split("\n")) {
      line = line.trim();
      if (!line || line.startsWith("#") || line.startsWith("```") || line.startsWith("|") || line.startsWith(">")) continue;
      line = line
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_`#>]/g, "")
        .trim();
      if (line) return line.length > 280 ? line.slice(0, 277) + "…" : line;
    }
  } catch {}
  return "";
}

const items = [];

// static posts
for (const sec of SITE.sections) {
  if (sec.dynamic || !sec.topics) continue;
  for (const top of sec.topics)
    for (const p of top.posts)
      items.push({
        title: p.title,
        link: `${BASE}/#/${sec.slug}/${top.slug}/${p.slug}`,
        date: p.date,
        cats: p.tags || [sec.title],
        desc: summary(`content/${sec.slug}/${top.slug}/${p.slug}.md`)
      });
}

// imported cyber notes
try {
  const idx = JSON.parse(read("content/cyber-index.json"));
  const walk = (node, slugs) => {
    for (const n of node.notes || [])
      items.push({
        title: n.name,
        link: `${BASE}/#/cybersecurity/${[...slugs, n.slug].map(encodeURIComponent).join("/")}`,
        date: n.date,
        cats: ["cybersecurity"],
        desc: summary(n.file)
      });
    for (const d of node.dirs || []) walk(d, [...slugs, d.slug]);
  };
  walk(idx, []);
} catch (e) {
  console.warn("no cyber-index.json:", e.message);
}

items.sort((a, b) => (a.date < b.date ? 1 : -1));

const rfc822 = (d) => new Date(d + "T12:00:00Z").toUTCString();
const now = new Date().toUTCString();

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n` +
  `  <title>${esc(SITE.name)}</title>\n` +
  `  <link>${esc(BASE)}/</link>\n` +
  `  <description>${esc(SITE.roles.join(", "))}</description>\n` +
  `  <language>en</language>\n` +
  `  <lastBuildDate>${now}</lastBuildDate>\n` +
  `  <atom:link href="${esc(BASE)}/feed.xml" rel="self" type="application/rss+xml"/>\n` +
  items
    .map(
      (it) =>
        `  <item>\n` +
        `    <title>${esc(it.title)}</title>\n` +
        `    <link>${esc(it.link)}</link>\n` +
        `    <guid isPermaLink="false">${esc(it.link)}</guid>\n` +
        `    <pubDate>${rfc822(it.date)}</pubDate>\n` +
        it.cats.map((c) => `    <category>${esc(c)}</category>\n`).join("") +
        (it.desc ? `    <description>${esc(it.desc)}</description>\n` : "") +
        `  </item>`
    )
    .join("\n") +
  `\n</channel>\n</rss>\n`;

fs.writeFileSync(path.join(ROOT, "feed.xml"), xml);
console.log(`wrote feed.xml with ${items.length} items`);
