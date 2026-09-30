# bluenets1

A minimal, static personal site + blog — plain HTML/CSS/JS, no build step, academic-style layout.

## Sections

- **about** — intro + an experience timeline
- **ai-writings**, **bf1pr** — blog posts (Markdown)
- **cybersecurity** — a browsable folder tree generated from Obsidian note vaults
- **videos** — embedded YouTube walkthroughs with written notes

## Run locally

The pages load content with `fetch()`, so open it through a web server (not `file://`):

```bash
python3 -m http.server 8765
# then open http://localhost:8765
```

Any static server works (`npx serve`, VS Code Live Server, …).

## Editing content

All site data lives in [`content/site.js`](content/site.js):

- **Posts:** add `content/<section>/<topic>/<slug>.md`, then add `{ slug, title, date, tags }` to that topic's `posts`.
- **Videos:** same, plus `youtube: "<id>"` (the part after `embed/`).
- **Experience / intro / socials:** edit the fields at the top of `site.js`.

The **cybersecurity** section is generated from Obsidian vaults by
[`tools/import_notes.py`](tools/import_notes.py) into `content/cyber/` +
`content/cyber-index.json` (Obsidian embeds/wikilinks/callouts are converted and
images copied). Re-run after editing notes:

```bash
python3 tools/import_notes.py   # rebuild the notes tree
node   tools/gen_feed.js        # rebuild feed.xml
```

## Deploy (GitHub Pages)

It's a static site, so GitHub Pages serves it directly — no Python needed in
production. Settings → Pages → Source: `main` / root.

- `.nojekyll` is committed so image folders named `_img/` (underscore) are served.
- All asset paths are relative, so it works at a project-page subpath
  (`https://bluenets1.github.io/bluenets1/`).
- Set `url` in `content/site.js` to the deployed URL and re-run `node tools/gen_feed.js`
  so the RSS links are absolute-correct.
