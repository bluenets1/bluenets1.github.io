/*
 * Site content.
 *
 * Normal sections (ai-writings, bf1pr, videos) list their posts here:
 *   1. write   content/<section>/<topic>/<slug>.md
 *   2. add     { slug, title, date, tags } to that topic's `posts` below
 * Video notes also take  youtube: "<video id>"  (the part after watch?v=).
 *
 * The "cybersecurity" section is DYNAMIC — it's generated from the Obsidian
 * vault by  tools/import_notes.py  into content/cyber/ + content/cyber-index.json.
 * Re-run that script whenever the notes change; nothing here needs editing.
 */
window.SITE = {
  name: "bluenets1",
  // used to build absolute links in the RSS feed — change to your real domain
  url: "https://bluenets1.github.io",
  avatar: "assets/pfp.jpeg",
  roles: ["ai engineer", "low-level engineer", "security researcher"],
  bio: "I like knowing how things work one layer below where most people stop — from attention heads to page tables to the bugs hiding between them.",

  // about-page intro, shown as bullet points (**bold** supported)
  intro: [
    "AIエンジニア",
    "低レイヤーエンジニア",
    "セキュリティリサーチャー",
    "I like understanding systems one layer deeper than most people stop.",
    "From **attention heads to page tables**, I care about what's happening underneath the abstraction.",
    "I hunt for the bugs hiding **between the layers**.",
    "**Build. Break. Reverse. Understand.**"
  ],

  // Each entry: company, optional logo ("assets/companies/x.png" — empty = initials),
  // kind, location, period. Either a single `role`, or `positions: [{title, period}]`
  // for one company with several roles. Optional `points: [...]` and `skills`.
  experience: [
    {
      company: "Fitsol",
      logo: "assets/companies/fitsol.png",
      kind: "Full-time",
      location: "Gurugram, Haryana, India · On-site",
      period: "Mar 2026 — Present · 7 mos",
      positions: [
        { title: "AI Engineer", period: "Sep 2026 — Present · 2 mos" },
        { title: "SWE Intern", period: "Mar 2026 — Sep 2026 · 7 mos" }
      ],
      skills: "Python, Flask, +8 skills"
    },
    {
      company: "g0dx1lla.ctf",
      logo: "assets/companies/g0dx1lla.png",
      role: "CTF Player",
      kind: "Full-time",
      location: "London Area, United Kingdom · Remote",
      period: "Nov 2025 — Present · 1 yr",
      skills: "Reverse Engineering, binary exploitation, +3 skills"
    },
    {
      company: "HackerOne",
      logo: "assets/companies/hackerone.jpg",
      role: "Security Researcher",
      kind: "Part-time",
      location: "Remote",
      period: "Apr 2025 — Present · 1 yr 7 mos",
      points: ["Secured MyGov.in", "Secured x.com", "Secured m-pesa.com"]
    },
    {
      company: "HackerRank",
      logo: "assets/companies/hackerrank.png",
      role: "Software Engineer Intern",
      kind: "Internship",
      location: "Hyderabad, Telangana, India · Remote",
      period: "Oct 2024 — Jul 2025 · 10 mos",
      points: [
        "Developed and managed APIs to ensure data consistency in the Prisma backend.",
        "Collaborated with the team at HackerRank to enhance backend functionalities.",
        "Contributed to coding challenges on the HackerRank platform as a backend developer."
      ]
    },
    {
      company: "Google Operations Center",
      logo: "assets/companies/google-operations-center.jpg",
      fit: "contain",
      role: "Reverse Engineer Intern",
      kind: "Internship",
      location: "Bangalore Urban, Karnataka, India · Hybrid",
      period: "Sep 2024 — Jan 2025 · 5 mos",
      points: [
        "Analyzed 150+ binaries and executables to uncover hidden functionality, packed code, and malicious behavior across Windows and Linux systems.",
        "Performed static and dynamic analysis using tools like IDA Pro, Ghidra, and x64dbg to identify code flow, reverse algorithms, and detect vulnerabilities.",
        "Investigated and debugged low-level issues in software and drivers using disassemblers and debuggers, improving analysis accuracy by 35%.",
        "Documented reverse-engineering findings and provided reports through Jira and Freshdesk, maintaining a 95%+ task resolution accuracy."
      ],
      skills: "Reverse Engineering, Jadx, +9 skills"
    },
    {
      company: "AuraX",
      logo: "assets/companies/aurax.png",
      fit: "contain",
      role: "Frontend Developer",
      kind: "Internship",
      location: "On-site",
      period: "Jun 2023 — Jan 2024 · 8 mos",
      skills: "Front-End Design, Web Interface Design, +3 skills"
    }
  ],

  socials: [
    { label: "github", url: "https://github.com/bluenets1" },
    { label: "x", url: "https://x.com/bluenets1" },
    { label: "instagram", url: "https://instagram.com/bluenets1" }
  ],

  // order here = order in the top nav
  sections: [
    {
      slug: "ai-writings",
      title: "ai-writings",
      desc: "notes on models, inference, and building with LLMs",
      topics: [
        {
          slug: "llm-internals",
          title: "llm-internals",
          desc: "what actually happens inside a transformer",
          posts: [
            { slug: "how-an-ai-model-uses-a-computer", title: "How an AI Model Uses a Computer", date: "2026-10-07", tags: ["agents", "computer-use", "vision"] },
            { slug: "stop-paying-your-llm-to-say-wait", title: "Stop Paying Your LLM to Say “Wait”", date: "2026-09-25", tags: ["llms", "reasoning", "inference"] },
          ]
        },
        {
          slug: "building-with-llms",
          title: "building-with-llms",
          desc: "getting useful, reliable output out of models",
          posts: [
            { slug: "structured-outputs", title: "structured outputs that don't break", date: "2026-09-23", tags: ["json", "production"] },
            { slug: "rag-is-just-search", title: "rag is just search with extra steps", date: "2026-09-16", tags: ["rag", "retrieval"] }
          ]
        }
      ]
    },
    {
      slug: "bf1pr",
      title: "bf1pr",
      desc: "bf1pr",
      topics: [
        {
          slug: "basics",
          title: "basics",
          desc: "starting point",
          posts: [
            { slug: "hello-bf1pr", title: "hello bf1pr", date: "2026-09-10", tags: ["intro"] },
            { slug: "project-layout", title: "how this section is organized", date: "2026-09-08", tags: ["meta"] }
          ]
        }
      ]
    },
    {
      slug: "cybersecurity",
      title: "cybersecurity",
      desc: "my cybersecurity notes — networking, crypto, web, tooling, write-ups",
      dynamic: true
    },
    {
      slug: "videos",
      title: "videos",
      desc: "video walkthroughs with written notes",
      video: true,
      topics: [
        {
          slug: "low-level",
          title: "low-level",
          desc: "systems programming on camera",
          posts: [
            { slug: "virtual-memory-walkthrough", title: "a tour of virtual memory", date: "2026-09-26", tags: ["memory", "mmu"], youtube: "" },
            { slug: "how-syscalls-work", title: "how syscalls work", date: "2026-09-25", tags: ["linux", "kernel"], youtube: "" }
          ]
        },
        {
          slug: "cybersecurity",
          title: "cybersecurity",
          desc: "security & ctf walkthroughs on camera",
          posts: [
            { slug: "malware-analysis", title: "Intro to Malware Analysis", date: "2026-10-01", tags: ["malware", "blue team"], youtube: "sPingg4kaRo" },
            { slug: "containers", title: "Containers — A Security Lens", date: "2026-10-01", tags: ["containers", "isolation"], youtube: "g0DSsetKAWs" },
            { slug: "wtf-are-proxies", title: "WTF Are Proxies?!", date: "2026-10-01", tags: ["proxies", "networking"], youtube: "m9bcx0qVjOE" },
            { slug: "wtf-sql-injection", title: "WTF! Is This SQL Injection?! (for beginners)", date: "2026-10-01", tags: ["sql injection", "web"], youtube: "kPE1fDt8ORc" }
          ]
        }
      ]
    }
  ]
};
