#!/usr/bin/env python3
"""
Import an Obsidian cybersecurity vault into the site as a browsable tree.

  src : /home/batspeed/batspeed/notes/Cybersecurity
  out : content/cyber/**            (slugged mirror of .md + images)
  idx : content/cyber-index.json    (tree manifest the site reads)

Re-run any time the notes change:  python3 tools/import_notes.py
"""
import os, re, json, shutil, sys

SRC = "/home/batspeed/batspeed/notes/Cybersecurity"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "content", "cyber")
IDX = os.path.join(ROOT, "content", "cyber-index.json")
WEB = "content/cyber"                       # path as referenced from the served page

SKIP_DIRS = {".git", ".obsidian", ".trash"}
IMG_EXT = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".ico"}

# Vaults to import into the cybersecurity section.
#   path    : source folder
#   dest    : slug path under content/cyber/ ([] = merge at the section root)
#   label   : if set, wrap the vault as one top-level folder with this name
#   exclude : top-level entries (relative to `path`) to skip
SOURCES = [
    {
        "path": "/home/batspeed/batspeed/notes/Cybersecurity",
        "dest": [],
        "label": None,
        "exclude": {
            "SOC Analyst",
            "THM-ROOMS-WRITEUP",
            "Web Hacking",      # root-level one (2 notes); the deeper
                                # "Cybersecurity 101/Web Hacking" is kept
            "CyberJobs",
            "Natas Flags",
            "Sudog0d_s Plan",
        },
    },
    {
        "path": "/home/batspeed/batspeed/notes/pwn.college",
        "dest": ["pwn-college"],
        "label": "pwn.college",
        "exclude": set(),
        "redact": True,          # hide pwn.college{...} / flag{...} tokens
    },
]

# flag formats to blank out when a source has redact=True
FLAG_RE = [
    (re.compile(r"pwn\.college\{[^}\n]*\}"), "pwn.college{REDACTED}"),
    (re.compile(r"\bflag\{[^}\n]*\}", re.I), "flag{REDACTED}"),
    (re.compile(r"\bhtb\{[^}\n]*\}", re.I), "htb{REDACTED}"),
    (re.compile(r"\bTHM\{[^}\n]*\}", re.I), "THM{REDACTED}"),
]

# ---- obsidian callout type -> our 5 supported kinds -----------------------
CALLOUT = {
    "note": "NOTE", "info": "NOTE", "abstract": "NOTE", "summary": "NOTE",
    "tldr": "NOTE", "example": "NOTE", "quote": "NOTE", "cite": "NOTE",
    "question": "NOTE", "faq": "NOTE", "help": "NOTE", "todo": "NOTE",
    "tip": "TIP", "hint": "TIP", "important": "IMPORTANT", "success": "TIP",
    "check": "TIP", "done": "TIP",
    "warning": "WARNING", "caution": "WARNING", "attention": "WARNING",
    "danger": "IMPORTANT", "error": "IMPORTANT", "bug": "IMPORTANT",
    "failure": "IMPORTANT", "fail": "IMPORTANT", "missing": "IMPORTANT",
}

def slug(name):
    s = name.lower()
    s = re.sub(r"[''\"]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "item"

def uniq(base, used):
    s = base; i = 2
    while s in used:
        s = f"{base}-{i}"; i += 1
    used.add(s)
    return s

def date_of(path):
    import datetime
    return datetime.date.fromtimestamp(os.path.getmtime(path)).isoformat()

# ---- image index: basename(lower) -> absolute path -----------------------
IMAGES = {}
def build_image_index(roots):
    for root in roots:
        for dp, dn, fn in os.walk(root):
            dn[:] = [d for d in dn if d not in SKIP_DIRS]
            for f in fn:
                if os.path.splitext(f)[1].lower() in IMG_EXT:
                    IMAGES.setdefault(f.lower(), os.path.join(dp, f))

_copied = {}
def copy_image(src_abs, dest_dir_fs, web_dir):
    """copy an image into <dest>/_img and return its web path."""
    key = (src_abs, dest_dir_fs)
    if key in _copied:
        return _copied[key]
    base = os.path.basename(src_abs)
    name, ext = os.path.splitext(base)
    fname = slug(name) + ext.lower()
    img_dir = os.path.join(dest_dir_fs, "_img")
    os.makedirs(img_dir, exist_ok=True)
    # avoid clobbering a *different* image that slugged to the same name
    dest = os.path.join(img_dir, fname)
    n = 2
    while os.path.exists(dest) and os.path.getsize(dest) != os.path.getsize(src_abs):
        fname = f"{slug(name)}-{n}{ext.lower()}"
        dest = os.path.join(img_dir, fname)
        n += 1
    shutil.copy2(src_abs, dest)
    web = f"{web_dir}/_img/{fname}"
    _copied[key] = web
    return web

def resolve_image(ref, src_md_dir):
    ref = ref.strip().split("|")[0].strip()        # drop obsidian |size
    ref = ref.split("#")[0].strip()
    if not ref:
        return None
    # 1) relative to the note
    cand = os.path.normpath(os.path.join(src_md_dir, ref))
    if os.path.isfile(cand):
        return cand
    # 2) by basename anywhere in the vault (obsidian style)
    hit = IMAGES.get(os.path.basename(ref).lower())
    return hit

def transform(text, src_md_dir, dest_dir_fs, web_dir, redact=False):
    # strip YAML frontmatter
    text = re.sub(r"^﻿?---\n.*?\n---\n", "", text, count=1, flags=re.S)

    if redact:
        for rx, repl in FLAG_RE:
            text = rx.sub(repl, text)

    def img_link(ref, alt=""):
        src = resolve_image(ref, src_md_dir)
        if not src:
            return f"*(missing image: {os.path.basename(ref)})*"
        return f"![{alt}]({copy_image(src, dest_dir_fs, web_dir)})"

    # obsidian embeds ![[...]]
    def emb(m):
        target = m.group(1)
        base = target.split("|")[0].split("#")[0].strip()
        if os.path.splitext(base)[1].lower() in IMG_EXT:
            return img_link(target)
        disp = target.split("|")[-1] if "|" in target else base
        return f"*{disp}*"
    text = re.sub(r"!\[\[([^\]]+)\]\]", emb, text)

    # standard images ![alt](path)
    def std(m):
        alt, path = m.group(1), m.group(2)
        p = path.strip()
        if re.match(r"^[a-z]+://", p):      # external url, keep
            return m.group(0)
        if p.startswith(WEB + "/") or p.startswith("content/"):
            return m.group(0)               # already resolved by the embed pass — leave it
        return img_link(p, alt)
    text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", std, text)

    # wikilinks [[target|alias]] -> alias text (no broken links)
    def wl(m):
        t = m.group(1)
        disp = t.split("|")[-1] if "|" in t else t.split("#")[0]
        return disp.strip()
    text = re.sub(r"(?<!\!)\[\[([^\]]+)\]\]", wl, text)

    # normalize obsidian callout markers  > [!info] Title
    def cal(m):
        kind = CALLOUT.get(m.group(1).lower(), "NOTE")
        return f"> [!{kind}] "
    text = re.sub(r">\s*\[!([a-zA-Z]+)\][-+]?\s*", cal, text)

    return text.strip() + "\n"

def write_note(src_md, dest_parts, s, redact=False):
    dest_dir_fs = os.path.join(OUT, *dest_parts) if dest_parts else OUT
    os.makedirs(dest_dir_fs, exist_ok=True)
    web_dir = "/".join([WEB] + list(dest_parts))
    with open(src_md, encoding="utf-8", errors="replace") as f:
        text = f.read()
    out = transform(text, os.path.dirname(src_md), dest_dir_fs, web_dir, redact)
    if not out.strip():                 # skip empty / whitespace-only notes
        return None
    out_fs = os.path.join(dest_dir_fs, s + ".md")
    with open(out_fs, "w", encoding="utf-8") as f:
        f.write(out)
    return "/".join([WEB] + list(dest_parts) + [s + ".md"])

def process(fs_dir, dest_parts, src_root, exclude, redact=False):
    """returns (dirs, notes) for fs_dir."""
    try:
        entries = sorted(os.listdir(fs_dir), key=natural)
    except OSError:
        return [], []
    used = set()
    dirs, notes = [], []
    def excluded(e):
        return os.path.relpath(os.path.join(fs_dir, e), src_root) in exclude
    subdirs = [e for e in entries if os.path.isdir(os.path.join(fs_dir, e)) and e not in SKIP_DIRS and not excluded(e)]
    mdfiles = [e for e in entries if e.lower().endswith(".md") and os.path.isfile(os.path.join(fs_dir, e)) and not excluded(e)]

    for e in subdirs:
        us = uniq(slug(e), used)
        c_dirs, c_notes = process(os.path.join(fs_dir, e), list(dest_parts) + [us], src_root, exclude, redact)
        if not c_dirs and len(c_notes) == 1:            # collapse folder-with-one-note
            n = c_notes[0]
            notes.append({"name": e, "slug": us, "file": n["file"], "date": n["date"]})
        elif c_dirs or c_notes:
            dirs.append({"name": e, "slug": us, "dirs": c_dirs, "notes": c_notes})

    for m in mdfiles:
        name = m[:-3]
        us = uniq(slug(name), used)
        src = os.path.join(fs_dir, m)
        file = write_note(src, dest_parts, us, redact)
        if file:
            notes.append({"name": name, "slug": us, "file": file, "date": date_of(src)})

    notes.sort(key=lambda n: natural(n["name"]))
    dirs.sort(key=lambda d: natural(d["name"]))
    return dirs, notes

def natural(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]

def count(node):
    c = len(node.get("notes", []))
    for d in node.get("dirs", []):
        c += count(d)
    return c

def main():
    for s in SOURCES:
        if not os.path.isdir(s["path"]):
            print("source not found:", s["path"]); sys.exit(1)
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT, exist_ok=True)
    build_image_index([s["path"] for s in SOURCES])

    root_dirs, root_notes, used = [], [], set()
    for s in SOURCES:
        dirs, notes = process(s["path"], list(s["dest"]), s["path"], s["exclude"], s.get("redact", False))
        if s.get("label"):
            root_dirs.append({"name": s["label"], "slug": uniq(s["dest"][-1], used),
                              "dirs": dirs, "notes": notes})
        else:
            for d in dirs:
                d["slug"] = uniq(d["slug"], used); root_dirs.append(d)
            for n in notes:
                n["slug"] = uniq(n["slug"], used); root_notes.append(n)

    root_dirs.sort(key=lambda d: natural(d["name"]))
    root_notes.sort(key=lambda n: natural(n["name"]))
    manifest = {"name": "cybersecurity", "dirs": root_dirs, "notes": root_notes}
    with open(IDX, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    total = count(manifest)
    print(f"imported {total} notes into {WEB}/  (top-level: {len(root_dirs)} folders, {len(root_notes)} notes)")
    print(f"images copied: {len(set(_copied.values()))}")
    print("manifest:", IDX)

if __name__ == "__main__":
    main()
