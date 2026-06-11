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

> **Note:** as of June 2026 the domain still delegates to Cloudflare
> nameservers (`jerry.ns.cloudflare.com` / `sarah.ns.cloudflare.com`) left
> over from a previous setup. Either switch the domain to Porkbun's default
> nameservers (Porkbun → Domain → Nameservers → reset to default) and add
> the records above in Porkbun's DNS editor, or keep Cloudflare and update
> the records in that Cloudflare account instead (set them to "DNS only"
> until GitHub issues the HTTPS certificate).

## Email

`manager@micap.pro` must be routed somewhere now that GoDaddy no longer
hosts the domain's mail. If DNS is on Porkbun nameservers, Porkbun's free
Email Forwarding (Domain → Email) can forward it to a personal inbox; on
Cloudflare nameservers, use Cloudflare Email Routing.
