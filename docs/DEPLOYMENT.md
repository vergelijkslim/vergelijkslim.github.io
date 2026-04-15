# Deployment Guide — vergelijkslim.nl

## Vercel Setup

1. Import the Git repository in the Vercel dashboard.
2. Vercel auto-detects the Astro framework. Verify these settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Node.js Version:** 22.x

## Domain Configuration

### Add domain in Vercel

1. Go to **Project Settings → Domains**.
2. Add `vergelijkslim.nl` as the primary domain.
3. Add `www.vergelijkslim.nl` (Vercel will auto-redirect to the apex domain via `vercel.json`).

### DNS Records

Configure these DNS records at your domain registrar:

| Type  | Name | Value                  | TTL  |
|-------|------|------------------------|------|
| A     | @    | 76.76.21.21            | 300  |
| AAAA  | @    | 2001:4860:4802:32::15  | 300  |
| CNAME | www  | cname.vercel-dns.com.  | 300  |

> Vercel's IP addresses may change. Always verify the current values in the Vercel dashboard under **Project Settings → Domains** after adding the domain.

### HTTPS

Vercel provisions SSL certificates automatically via Let's Encrypt once DNS propagation completes. No manual action required.

### Redirects

- `www.vergelijkslim.nl` → `vergelijkslim.nl` (301 permanent redirect, configured in `vercel.json`)

## Verification

After deployment:

1. Confirm `https://vergelijkslim.nl` loads the site.
2. Confirm `https://www.vergelijkslim.nl` redirects to the apex domain.
3. Confirm sitemap is accessible at `https://vergelijkslim.nl/sitemap-index.xml`.
4. Verify SSL certificate is valid.
