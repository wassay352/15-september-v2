---
name: astro-site-builder
description: Build custom, minimal, professional websites for any niche using Astro, TSX/React islands, and Tailwind CSS v4. Use this skill whenever the user asks to build, scaffold, or start a new website/landing page/business site, especially when they mention "minimal design," "professional look," "fast/performant site," "SEO-optimized," "mobile-friendly," or naming a niche (e.g. "a site for a dental clinic," "landing page for a SaaS," "portfolio site"). Also use when adding pages, components, SEO metadata, or performance/mobile optimizations to an existing Astro project. Covers project scaffolding, design system setup (Tailwind v4 theme tokens), reusable component structure, image optimization, JSON-LD structured data, sitemap/robots setup, and mobile-first responsive patterns.
---

# Astro Multi-Niche Site Builder

A repeatable system for shipping clean, professional, fast, SEO-ready websites across any niche, built on Astro + TSX + Tailwind CSS v4. The goal every time: minimal design, top Lighthouse scores, correct SEO fundamentals, and mobile-first responsiveness.

## Core stack (always use this unless the user says otherwise)

- **Astro** (static output by default — `output: 'static'`)
- **React** only for interactive islands (`.tsx`) — nav toggles, forms, filters, carousels. Everything else stays `.astro` (zero JS shipped).
- **Tailwind CSS v4** — CSS-first config via `@theme`, no `tailwind.config.js` needed.
- **TypeScript strict mode**.
- Deploy target: **Cloudflare Pages** or **Vercel** (edge CDN, HTTP/2+ by default).

## Step 1: Scaffold the project

```bash
npm create astro@latest <site-name> -- --template minimal --typescript strict
cd <site-name>
npx astro add react tailwind
npx astro add sitemap
```

## Step 2: Set up the design system (Tailwind v4)

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", sans-serif;
  --font-serif: "Fraunces", serif; /* swap per niche if needed */
  --color-brand: oklch(0.6 0.15 250); /* swap per niche */
  --color-neutral-50: oklch(0.98 0 0);
  --color-neutral-900: oklch(0.15 0 0);
}
```

Rule of thumb per niche site: reuse the same scale/structure, only swap `--color-brand`, fonts, and imagery/copy. Never rebuild the design system from scratch — this is what keeps sites feeling professional and consistent to build.

Import once in the base layout: `import "../styles/global.css"`.

## Step 3: Project structure

```
src/
  components/       # Header.astro, Footer.astro, Hero.astro, CTA.astro, Card.astro
  layouts/
    BaseLayout.astro   # <head>, meta tags, JSON-LD, OG tags — SEO lives here
  islands/          # .tsx — only interactive bits (MobileNav.tsx, ContactForm.tsx)
  content/          # Astro Content Collections for niche-specific pages/blog
  styles/global.css
```

## Step 4: SEO checklist (bake into BaseLayout.astro, not bolted on later)

- One `<h1>` per page, logical heading hierarchy after that
- Per-page `<title>` and `<meta name="description">` passed as layout props
- Open Graph + Twitter card tags
- JSON-LD structured data as a prop-driven slot in `BaseLayout.astro` — pick the right schema per niche (`LocalBusiness`, `Product`, `Article`, `Service`, etc.)
- `@astrojs/sitemap` integration enabled in `astro.config.mjs`
- A `robots.txt` in `public/`
- Canonical URLs on every page

## Step 5: Performance checklist (target: Lighthouse 95+ across the board)

- Use `astro:assets` `<Image />` for every image — automatic AVIF/WebP + responsive `srcset`
- Keep interactive islands minimal; use `client:visible` or `client:idle` over `client:load` unless above-the-fold interactivity is required
- Self-host fonts via `@fontsource/*` packages instead of external font CDNs where possible, or use `font-display: swap`
- No render-blocking third-party scripts in `<head>`
- `output: 'static'` unless the project genuinely needs SSR

## Step 6: Mobile-first responsive rules

- Design and write Tailwind classes mobile-first: base styles = mobile, then layer `sm:` `md:` `lg:` `xl:` up
- Tap targets minimum 44x44px
- Test nav at 375px width first — mobile nav should be a `.tsx` island (`client:visible`) with a hamburger toggle, not a hidden desktop menu
- Avoid fixed-width containers; use `max-w-*` + `mx-auto` + fluid padding (`px-4 sm:px-6 lg:px-8`)
- Check that hero text/CTAs are readable and tappable without zoom on a small screen before considering a page done

## Reskinning for a new niche

To spin up a new niche site from this system:
1. Copy the base template (layouts, components, config)
2. Swap `--color-brand`, font tokens, logo/imagery
3. Update copy, JSON-LD schema type, and page content via Content Collections
4. Keep component structure and SEO/performance scaffolding untouched

This is what makes the multi-niche workflow fast without sacrificing quality on any single site.