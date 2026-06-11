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

GitHub Pages needs the following records:

| Type  | Host  | Value                |
| ----- | ----- | -------------------- |
| A     | @     | `185.199.108.153`    |
| A     | @     | `185.199.109.153`    |
| A     | @     | `185.199.110.153`    |
| A     | @     | `185.199.111.153`    |
| CNAME | `www` | `jmiaie.github.io`   |

> **Important — email lives in this DNS zone.** The domain delegates to
> Cloudflare nameservers (`jerry.ns.cloudflare.com` /
> `sarah.ns.cloudflare.com`), and that Cloudflare zone serves the Google
> Workspace MX/SPF records that keep `jmilam@micap.pro` (and aliases)
> working. **Do not reset nameservers to Porkbun defaults** without first
> recreating the mail records below — mail would start failing within the
> hour.
>
> **Recommended path:** keep the Cloudflare nameservers and edit only the
> website records in the Cloudflare dashboard: replace the existing `@`
> A/CNAME records with the four A records above and add/replace the `www`
> CNAME. Set them to **DNS only** (grey cloud, not proxied) so GitHub can
> issue the HTTPS certificate.

### Mail records (do not remove; recreate first if ever moving DNS)

| Type | Host             | Value                                                                                              |
| ---- | ---------------- | -------------------------------------------------------------------------------------------------- |
| MX   | @                | `1 aspmx.l.google.com`                                                                              |
| MX   | @                | `5 alt1.aspmx.l.google.com`                                                                         |
| MX   | @                | `5 alt2.aspmx.l.google.com`                                                                         |
| MX   | @                | `10 alt3.aspmx.l.google.com`                                                                        |
| MX   | @                | `10 alt4.aspmx.l.google.com`                                                                        |
| TXT  | @                | `v=spf1 include:spf.em.secureserver.net include:secureserver.net include:_spf.google.com ~all`     |
| TXT  | @                | `google-site-verification=1au0H4JOyOpj_P2Lxl7DKorG0B_PdxIlVzUt64APmUE`                              |
| TXT  | `_dmarc`         | `v=DMARC1; p=none; rua=mailto:dmarc_rua@onsecureserver.net`                                         |

Optional mail hygiene (no urgency, unrelated to the website):

- SPF still includes GoDaddy's `secureserver.net` servers, which no longer
  send for this domain. It can be trimmed to
  `v=spf1 include:_spf.google.com ~all`.
- DMARC aggregate reports go to a dead GoDaddy address; repoint `rua=` to a
  monitored mailbox (or a DMARC reporting service) if reports are wanted.
- DKIM with the standard Google selector (`google._domainkey`) is not
  published. It can be enabled in Google Admin → Apps → Google Workspace →
  Gmail → Authenticate email, then adding the TXT record it generates.

## Email

Mail for `micap.pro` is hosted on **Google Workspace** (`jmilam@micap.pro`
and aliases) and is routed by the MX records above — it is independent of
the website records and of where the site is hosted. The site's published
contact address is `manager@micap.pro`; confirm it exists as an alias or
group in the Google Workspace Admin console.
