# Deployment Guide

This is a Single Page Application (SPA) that requires server configuration to handle client-side routing properly. Direct links to routes like `/tickers` or `/sector/NGAN_HANG` need to serve the main `index.html` file so the client-side router can handle them.

## Deployment Platforms

### 1. Netlify (Recommended)
- ✅ **Automatic**: Uses `public/_redirects` file 
- No additional configuration needed
- Deploy command: `pnpm build`
- Publish directory: `dist`

### 2. Vercel
- ✅ **Automatic**: Uses `vercel.json` file
- No additional configuration needed
- Deploy command: `pnpm build`
- Output directory: `dist`

### 3. GitHub Pages
- ✅ **Configured**: Uses `public/404.html` + redirect handling
- Works with GitHub Actions workflow
- Static hosting with SPA fallback

### 4. Traditional Web Servers

#### Apache (.htaccess)
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

#### Nginx
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Express.js
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
```

## Build & Deploy

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Preview locally:**
   ```bash
   pnpm preview
   ```

3. **Deploy the `dist/` folder** to your chosen platform.

## Files Added for SPA Support

- `public/_redirects` - Netlify configuration
- `vercel.json` - Vercel configuration  
- `public/404.html` - GitHub Pages fallback
- Updated `src/main.tsx` - GitHub Pages redirect handling
- Updated `vite.config.ts` - Development server configuration

## Troubleshooting

**Problem**: Direct links return 404
**Solution**: Ensure your hosting platform serves `index.html` for all routes

**Problem**: Routing works in development but not in production
**Solution**: Check that the deployment configuration files are included in your build

**Problem**: GitHub Pages shows 404 on refresh
**Solution**: The `404.html` file should automatically redirect to the app with the correct path