# Status — micap.pro

**Updated:** 2026-11-24  
**Visibility:** public  
**Maturity:** static marketing site (Next.js 14, `output: 'export'`)  
**Branches:** `main` exists as a snapshot of the previous default tip, so a pull request can target it. The repository default may still be `claude/rebuild-micap-website-0xb8u` until the owner changes it in GitHub settings.

## What this repo is

Marketing site for **Micap LLC**, a boutique multinational consultancy: software, business, construction, and real estate. Static export only. No application backend, no form processor, and no secrets.

Published contact: `info@micap.pro` (must exist as a Google Workspace alias). Phone numbers are not published. The site does not name an individual.

## What is not claimed

- That the Porkbun nameserver cutover described in the README is finished
- That `micap.pro` already serves this build (that depends on DNS and Pages settings, which this repo does not change)
- Client names, testimonials, or a roster. Capability figures on the site describe scale of work, not named clients.
- That this remote is the only Micap web property. Micap AI (`https://micap.ai`) is the sister firm and is linked from the software division.

## DNS

Do not edit mail records from this repo. **Google Workspace MX, SPF, `google-site-verification`, and `_dmarc` records must be preserved.** See the README.
