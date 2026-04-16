# alexsverdlik.com

Alex Sverdlik Real Estate — Parkland, FL

## Setup (one time)

### 1. Create GitHub repo
```
# In this folder:
git init
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR_USERNAME/alexsverdlik-site.git
git push -u origin main
```

### 2. Connect Netlify
- Log into Netlify → "Add new site" → "Import an existing project"
- Connect to your GitHub → select this repo
- Netlify auto-detects netlify.toml — build command and publish dir are set
- Click Deploy. Site builds in ~30 seconds.
- In Domain settings → add custom domain `alexsverdlik.com`

### 3. Create Build Hook (for dashboard auto-publish)
- Netlify → Site settings → Build & deploy → Build hooks
- Click "Add build hook" → name it "Dashboard Publish" → Save
- Copy the URL (looks like `https://api.netlify.com/build_hooks/abc123...`)
- Paste this into the dashboard config (NETLIFY_HOOK)

### 4. Create GitHub Token (for dashboard auto-publish)
- Go to github.com/settings/tokens → "Generate new token (classic)"
- Scopes: check `repo` (full repo access)
- Copy the token
- Paste this into the dashboard config (GITHUB_TOKEN)

## How it works

- `build-site.js` generates all main pages (home, about, neighborhoods, etc.)
- `build-blog.js` generates blog pages from hardcoded posts + dashboard exports
- Dashboard exports land in `data/blog-approved.json`
- On build, base64 images are extracted to `dist/blog/images/` as proper JPEGs
- Netlify publishes `dist/`

## Manual build (local testing)
```
node build-site.js
node build-blog.js
# Open dist/index.html
```

## Auto-publish from dashboard
When Alex taps "Publish" in the dashboard:
1. Approved posts JSON is pushed to `data/blog-approved.json` via GitHub API
2. Netlify build hook is triggered
3. Site rebuilds with new posts in ~30 seconds
4. Blog images extracted from base64 → proper files
5. Posts live at alexsverdlik.com/blog/[slug]
