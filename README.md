# micap.pro

Marketing site for **Micap LLC**, a multinational business and technology consultancy. Five divisions:

1. Fractional Executive Services
2. Software Development & Digital Transformations
3. Business Consulting
4. Construction Services
5. Real Estate Advising & Strategy (capital, acquisitions, value-add)

The sister firm [Micap AI](https://micap.ai) is the Software Lab and AI Engineering practice. It is linked from the software division. The published contact address is `info@micap.pro` (the `CONTACT_EMAIL` constant in `lib/site.ts`). That address must exist as a Google Workspace alias or user before mail to it will arrive. Adding the alias does not change DNS.

Built with Next.js 14 and Tailwind CSS. The production build is a **fully static export** (`output: 'export'`) and can be hosted on Cloudflare Pages or GitHub Pages.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # static export to ./out
npm run lint
```

`npm run build` writes the site to `./out`, including `sitemap.xml`, `robots.txt`, and `404.html`. Video files are self-hosted under `public/media/`. Sources and licenses are in [`CREDITS.md`](CREDITS.md).

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the static export and publishes `./out` to GitHub Pages on pushes to `main` and to `claude/rebuild-micap-website-0xb8u`. It can also be run from the Actions tab.

The same `./out` directory is what you upload for Cloudflare Pages (framework preset: Next.js, or a direct upload of the export). No server runtime and no environment secrets are required.

One-time GitHub Pages setup, if it is not already done:

1. GitHub → repo **Settings → Pages** → Source: **GitHub Actions**.
2. Custom domain: `micap.pro` → Save. `public/CNAME` already contains `micap.pro`.
3. After the DNS check passes and the certificate is issued, tick **Enforce HTTPS**.

`main` was created from the previous default tip (`claude/rebuild-micap-website-0xb8u`) so pull requests have a normal base. If GitHub still shows the old branch as the default, set the default branch to `main` in the repository settings when you are ready. This repository does not change DNS.

## DNS (domain registered at Porkbun)

**Preserve mail.** The Google Workspace **MX** records, the **SPF** TXT record, the **`google-site-verification`** TXT record, and the **`_dmarc`** TXT record must be preserved. Do not replace them with a host’s default email forwarding. The website can move between GitHub Pages and Cloudflare Pages; those four kinds of records are what keep Google Workspace mail working, including `info@micap.pro` once that alias exists. This repository does not manage DNS.

As of June 2026 the live zone is a leftover **Cloudflare** zone
(`jerry.ns.cloudflare.com` / `sarah.ns.cloudflare.com`) from the GoDaddy
era, with no known account access. It serves the Google Workspace mail
records (which is why Workspace mail kept working after GoDaddy was cut
off) plus website records pointing at the dead GoDaddy origin.

The migration plan: **stage the complete record set in Porkbun's DNS
editor first** (those records are dormant while the nameservers point
elsewhere), **then** reset the nameservers to Porkbun defaults. During
propagation both zones answer the same Google MX targets, so mail is never
interrupted. DNSSEC is not enabled on the domain (verified June 2026), so
the nameserver switch carries no DS-record risk.

The A and `www` records below are the website records for **GitHub Pages**. Hosting the same static export on Cloudflare Pages would use different website records. Either way, the Google Workspace MX, SPF, `google-site-verification`, and `_dmarc` records must be preserved.

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
  `; rua=mailto:info@micap.pro` to receive the (XML, often noisy) reports.
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

Mail for `micap.pro` is hosted on **Google Workspace**, routed by the MX
records above — independent of the website and its hosting.

The site’s published contact address is `info@micap.pro`. Create it in
Google Admin as an **email alias** (or a user) before the form and mailto
links will deliver. That is a mailbox setting, not a DNS record. Do not
touch MX, SPF, `google-site-verification`, or `_dmarc` when you add it. If a
`manager@micap.pro` alias already exists, leave it; it is also a mailbox
setting, not a website record.
