# 🌲 Veka

**The Minimalist Digital Garden & Wiki Starter for Astro.**

Veka is not a competitor to massive documentation frameworks. It is the antithesis. Built specifically for those who want a fast, organic place to take notes — a digital garden or personal wiki — free from rigid routing configuration.

Drop your Markdown files into the folder, and let the system weave them together automatically.

![Astro](https://img.shields.io/badge/Astro-3.0+-FF7E33?style=flat-square&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Pagefind](https://img.shields.io/badge/Search-Pagefind-blue?style=flat-square)

![Veka Dashboard Preview](./public/preview-home.png)
![Note Preview](./public/preview-note.png)
![Note Preview](./public/preview-note-2.png)

---

## ⚡ Why Veka?

- **Zero-Config Routing:** No need to register navigation in a config file. Create folders as deep as you like (e.g. `src/content/wiki/koding/arsitektur/`), and URLs with sidebar navigation are generated automatically.
- **Ultra-Fast Static Search:** Powered by [Pagefind](https://pagefind.app/). Search is indexed locally during the build process — no third-party services required.
- **Zod Schema Validation:** Frontmatter is strictly validated. No more build errors from a missing title or incorrectly formatted date.
- **"Digital Garden" Concept:** Comes with a `growthStage` property (`seedling`, `budding`, `evergreen`) to track the maturity level of each note.
- **100% Lighthouse Score:** The UI is built selectively using minimal components and vanilla JS for interactivity, ensuring zero runtime bloat.

---

## 🚀 Quick Start (Under 1 Minute)

Run these commands in your terminal to clone the template and start a local server:

```bash
# 1. Clone this repository (or use degit)
pnpm dlx degit masmuss/veka my-wiki

# 2. Enter the directory
cd my-wiki

# 3. Install dependencies
pnpm install

# 4. Start the local server
pnpm run dev
```

Important Note for Search Features: Pagefind search works by reading the static build output. To test search locally, you must run npm run build followed by npm run preview.

## 📝 How to Write Notes

All your notes live in the `src/content/wiki/` directory. Feel free to create new sub-directories. Every `.md` or `.mdx` file must include the following frontmatter:

```plaintext
---
title: "Your Note Title"
description: "Brief description for SEO and search snippets."
createdAt: 2026-07-05
updatedAt: 2026-07-05
tags: ["concept", "idea"]
isPinned: false
growthStage: "seedling" # Options: seedling | budding | evergreen
---

Write your thoughts here using Markdown...
```

## 🏗️ Project Structure

```plaintext
├── src/
│   ├── content/
│   │   ├── config.ts       # Zod schema validation
│   │   └── wiki/           # Your markdown files and folders
│   ├── layouts/
│   │   ├── BaseLayout.astro # Pure HTML shell (SEO & Meta)
│   │   └── WikiLayout.astro # 3-Column Grid (Nav, Content, TOC)
│   └── pages/
│       ├── index.astro      # Dashboard / Home
│       └── wiki/
│           └── [...slug].astro # Dynamic routing engine
└── tailwind.config.mjs
```

## 🌍 Deployment

Veka is configured as a Static Site Generator (SSG) by default. Deployment is seamless on platforms like Vercel, Netlify, or Cloudflare Pages.
Make sure your build command on the target platform is set to: `pnpm run build`
This command will automatically run `astro build` and trigger the pagefind integration to build the search index.
