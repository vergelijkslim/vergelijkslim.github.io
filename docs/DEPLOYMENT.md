# Deployment Guide — zonnewijzer.github.io

## GitHub Pages Setup

### 1. Create GitHub Account & Repository

1. Create a GitHub account with username `zonnewijzer` at https://github.com/signup.
2. Create a new **public** repository named `zonnewijzer.github.io`.
   - This special repo name enables the site at `https://zonnewijzer.github.io`.

### 2. Push This Codebase

```bash
git remote add origin https://github.com/zonnewijzer/zonnewijzer.github.io.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to **Settings → Pages** in the repository.
2. Under **Source**, select **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) will automatically build and deploy on every push to `main`.

### 4. Verify

After the first push, the GitHub Actions workflow will run. Check:

1. **Actions tab** — confirm the "Deploy to GitHub Pages" workflow completes successfully.
2. Visit `https://zonnewijzer.github.io` — the site should load.
3. Confirm sitemap at `https://zonnewijzer.github.io/sitemap-index.xml`.

## Future: Custom Domain (zonnewijzer.nl)

When ready to use the real domain:

1. Update `astro.config.mjs`: change `site` to `https://zonnewijzer.nl`.
2. In repo **Settings → Pages → Custom domain**, enter `zonnewijzer.nl`.
3. Configure DNS at registrar:

| Type  | Name | Value                              | TTL  |
|-------|------|------------------------------------|------|
| A     | @    | 185.199.108.153                    | 300  |
| A     | @    | 185.199.109.153                    | 300  |
| A     | @    | 185.199.110.153                    | 300  |
| A     | @    | 185.199.111.153                    | 300  |
| CNAME | www  | zonnewijzer.github.io.           | 300  |

4. Enable **Enforce HTTPS** in Settings → Pages.
5. GitHub auto-provisions an SSL certificate.
