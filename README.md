# micap.pro

Marketing site for **Micap LLC** — project management and management
consulting across sustainable energy, construction, real estate, and
technology.

Built with Next.js 14 + Tailwind CSS, statically exported and hosted on
**GitHub Pages**.

## Development

```bash
npm install
npm run dev    # local dev server at http://localhost:3000
npm run build  # static export to ./out
```

## Deployment

Every push to the default branch runs
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
the static export and publishes it to GitHub Pages. It can also be run
manually from the Actions tab ("Deploy to GitHub Pages" → Run workflow).

One-time setup after the first deploy:

1. GitHub → repo **Settings → Pages** → Custom domain: `micap.pro` → Save.
2. Once the DNS check passes and the certificate is issued, tick
   **Enforce HTTPS**.

## DNS (domain registered at Porkbun)

As of June 2026 the live zone is a leftover **Cloudflare** zone
(`jerry.ns.cloudflare.com` / `sarah.ns.cloudflare.com`) from the GoDaddy
era, with no known account access. It serves the Google Workspace mail
records (which is why `jmilam@micap.pro` kept working after GoDaddy was cut
off) plus website records pointing at the dead GoDaddy origin.

The migration plan: **stage the complete record set in Porkbun's DNS
editor first** (those records are dormant while the nameservers point
elsewhere), **then** reset the nameservers to Porkbun defaults. During
propagation both zones answer the same Google MX targets, so mail is never
interrupted. DNSSEC is not enabled on the domain (verified June 2026), so
the nameserver switch carries no DS-record risk.

### 1. Stage records at Porkbun

Delete Porkbun's default email-forwarding records first — they would
otherwise hijack Google Workspace mail the moment the nameservers switch:

- ~~MX `fwd1.porkbun.com` (prio 10)~~
- ~~MX `fwd2.porkbun.com` (prio 20)~~
- ~~TXT `v=spf1 include:_spf.porkbun.com ~all`~~

Then create:

| Type  | Host     | Answer                                                                | Priority | Purpose            |
| ----- | -------- | --------------------------------------------------------------------- | -------- | ------------------ |
| MX    | (blank)  | `aspmx.l.google.com`                                                  | 1        | Google Workspace   |
| MX    | (blank)  | `alt1.aspmx.l.google.com`                                             | 5        | Google Workspace   |
| MX    | (blank)  | `alt2.aspmx.l.google.com`                                             | 5        | Google Workspace   |
| MX    | (blank)  | `alt3.aspmx.l.google.com`                                             | 10       | Google Workspace   |
| MX    | (blank)  | `alt4.aspmx.l.google.com`                                             | 10       | Google Workspace   |
| TXT   | (blank)  | `v=spf1 include:_spf.google.com ~all`                                 | —        | SPF                |
| TXT   | (blank)  | `google-site-verification=1au0H4JOyOpj_P2Lxl7DKorG0B_PdxIlVzUt64APmUE` | —        | Domain verification |
| TXT   | `_dmarc` | `v=DMARC1; p=none`                                                    | —        | DMARC              |
| A     | (blank)  | `185.199.108.153`                                                     | —        | GitHub Pages       |
| A     | (blank)  | `185.199.109.153`                                                     | —        | GitHub Pages       |
| A     | (blank)  | `185.199.110.153`                                                     | —        | GitHub Pages       |
| A     | (blank)  | `185.199.111.153`                                                     | —        | GitHub Pages       |
| CNAME | `www`    | `jmiaie.github.io`                                                    | —        | GitHub Pages       |

Migration notes:

- The SPF record is deliberately trimmed from the old zone's value: the
  `secureserver.net` includes covered GoDaddy senders that no longer exist.
- The old DMARC record sent aggregate reports to a dead GoDaddy address;
  `p=none` keeps DMARC present without reports. Append
  `; rua=mailto:jmilam@micap.pro` to receive the (XML, often noisy) reports.
- `email.micap.pro` and `autodiscover.micap.pro` exist in the old zone as
  GoDaddy/Outlook-era leftovers and are intentionally not carried over.
- No DKIM selector is published in the old zone, so there is none to copy.
  Enabling Google DKIM afterwards is recommended: Google Admin → Apps →
  Google Workspace → Gmail → Authenticate email → generate the
  `google._domainkey` TXT record and add it at Porkbun.

### 2. Switch nameservers

Porkbun → domain → **Nameservers** → reset to Porkbun defaults
(`curitiba` / `fortaleza` / `maceio` / `salvador.ns.porkbun.com`). Most
resolvers pick the change up within an hour or two; stragglers up to
24–48 h. Mail is unaffected throughout because both old and new zones point
MX at the same Google servers.

## Email

Mail for `micap.pro` is hosted on **Google Workspace** (`jmilam@micap.pro`
and aliases), routed by the MX records above — independent of the website
and its hosting.

The site's published contact address is `manager@micap.pro`, configured as
an **email alias** of `jmilam@micap.pro` in the Google Admin console
(Directory → Users → select user → User information → Email aliases). To
reply *from* the address, add it in Gmail → Settings → Accounts → "Send
mail as". If it ever needs a dedicated mailbox, delete the alias and create
a `manager@` user (one Workspace license) — no DNS changes required.
