# Status — micap.pro

**Updated:** 2026-09-30 (PT)  
**Visibility:** public  
**Maturity:** stalled marketing-site WIP  
**Default branch:** `claude/rebuild-micap-website-0xb8u` (**no `main`** on this remote today)

## Honest positioning

Next.js 14 + Tailwind marketing site for **Micap LLC** (project management / consulting narrative). Tree is a small App Router landing (`app/page.tsx` + layout/styles) plus GitHub Pages deploy workflow docs.

| Claim in older README tone | Reality |
|----------------------------|---------|
| Live custom-domain site always current | DNS/migration notes describe a **stalled** Porkbun ↔ leftover Cloudflare zone cutover; do not assume `micap.pro` content equals this tip without checking DNS/Pages |
| Production SaaS / product | **Marketing landing only** — no app backend in this repo |
| Default branch `main` | HEAD = `claude/rebuild-micap-website-0xb8u` |

Sibling Micap web/name properties exist across many remotes (`MicapAI`, `ai.micap`, `jeff-milam-portfolio`, `micapai.com`, …). **Canonical consolidation is an owner decision** — this STATUS does not archive siblings.

## Offline quickstart

```bash
npm install
npm run dev     # localhost:3000
npm run build   # static export intent per README / next config
```

Recorded on this box 2026-09-30 PT: `npm run build` **succeeded** (static pages generated). Next 14.2.15 install printed an upstream security-advisory deprecation warning — upgrade is owner follow-up; not patched in this docs wave.

## Workflows

`.github/workflows/deploy.yml` exists. This advance **does not** modify workflow files (token lacks `workflow` scope / hard rule).

## What is **not** claimed

- That DNS cutover is complete  
- SEO/lead KPIs or active campaign metrics  
- That this remote is the only Micap web property

## Next (owner)

1. Create a real `main` (or rename default) when ready  
2. Finish DNS cutover checklist in README **or** mark domain docs historical  
3. Consolidate Micap web remotes; bump Next past advisory when touching deps  
4. CAREER outbound remains gated elsewhere — this repo is site hygiene only
