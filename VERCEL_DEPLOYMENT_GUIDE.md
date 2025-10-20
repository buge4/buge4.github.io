# Deploy Veriton Genesis to veriton.io via Vercel

## Overview

This guide will connect your GitHub repository to Vercel so that:
1. Your website deploys to **veriton.io** (custom domain)
2. Future code changes **automatically deploy** when pushed to GitHub
3. No more manual ZIP packages needed

---

## Prerequisites

✅ GitHub repository created: https://github.com/buge4/veriton-genesis (PRIVATE)
✅ Code pushed to repository
✅ Vercel account (free tier works)
✅ Domain veriton.io registered and accessible

---

## Step 1: Connect GitHub to Vercel

### 1.1 Log in to Vercel
- Go to: https://vercel.com
- Sign in with your account (or create one)

### 1.2 Import GitHub Repository
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. If this is your first time:
   - Click **"Install GitHub App"**
   - Authorize Vercel to access your GitHub account
   - Select **"Only select repositories"**
   - Choose `buge4/veriton-genesis`
   - Click **"Install"**

4. Back on Vercel, you'll see `veriton-genesis` in the list
5. Click **"Import"** next to it

---

## Step 2: Configure the Project

### 2.1 Project Settings

**Framework Preset:** Vite
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `dist` (auto-detected)

### 2.2 Environment Variables

Click **"Environment Variables"** and add these:

```
VITE_SUPABASE_URL=https://xprtzodwutgskpdvyxwn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcnR6b2R3dXRnc2twZHZ5eHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NTU3MTksImV4cCI6MjA0NTQzMTcxOX0.YqFz9gM2hSC5qhKO2Svu5TrUMC59baBSGQdqS4J2iVw
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
```

**Important:** Add these for all environments (Production, Preview, Development)

### 2.3 Deploy

Click **"Deploy"**

Vercel will:
1. Clone the repository
2. Install dependencies
3. Build the project
4. Deploy to a temporary URL (e.g., `veriton-genesis.vercel.app`)

This takes about 2-3 minutes.

---

## Step 3: Add Custom Domain (veriton.io)

### 3.1 In Vercel Dashboard

1. After deployment completes, click on your project
2. Go to **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter: `veriton.io`
5. Click **"Add"**

### 3.2 Configure DNS Records

Vercel will show you the DNS configuration needed. You have two options:

#### Option A: CNAME (Recommended)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

#### Option B: A Record
```
Type: A
Name: @
Value: 76.76.21.21
```

### 3.3 Update DNS at Your Domain Registrar

1. Log in to wherever you registered veriton.io (e.g., Namecheap, GoDaddy, Cloudflare)
2. Go to DNS settings
3. Add the record shown by Vercel
4. Save changes

**Note:** DNS changes can take 24-48 hours to propagate, but usually work within 1-2 hours.

### 3.4 Add www Subdomain (Optional)

If you want `www.veriton.io` to also work:

1. In Vercel, add another domain: `www.veriton.io`
2. Add this DNS record:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Step 4: Verify Deployment

### 4.1 Check Vercel Status

- In Vercel dashboard, domains should show: ✅ `veriton.io`
- Status should be: **Valid Configuration**

### 4.2 Test the Website

Visit: https://veriton.io

You should see:
- ✅ Homepage with TVRF content
- ✅ Business Hub accessible at `/business-hub`
- ✅ Veriton Genesis requires login at `/veriton-genesis`
- ✅ AI Admin requires login at `/admin`

### 4.3 Test Login

Credentials:
- Email: bvhauge@gmail.com
- Password: Trysil416!

Should grant access to Veriton Genesis and AI Admin.

---

## Step 5: Automatic Deployments (THE MAGIC)

### How It Works Now:

**Old Way (Manual):**
```
Make changes → Create ZIP → Send to friend → Friend deploys
```

**New Way (Automatic):**
```
Make changes → Push to GitHub → ✨ Vercel auto-deploys to veriton.io
```

### What This Means:

1. **Any code changes** pushed to the `main` branch on GitHub
2. **Automatically trigger** a new build on Vercel
3. **Deploy to veriton.io** within 2-3 minutes
4. **No manual intervention** needed

### You'll Get Notifications:

- Email from Vercel: "Deployment succeeded"
- Vercel dashboard shows deployment status
- You can see build logs if anything fails

---

## How to Make Future Changes

### For the Developer (You/Your Team):

1. Make code changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. Wait 2-3 minutes
4. Changes are live on veriton.io

### For Your Friend (Domain Owner):

**Nothing!** They just need to:
- Keep the Vercel account active (free)
- Keep the domain DNS pointed to Vercel

That's it. No more packages, no more manual deployments.

---

## Troubleshooting

### Build Fails

1. Check Vercel deployment logs
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Domain Not Working

1. Check DNS propagation: https://dnschecker.org
2. Verify DNS records match Vercel's requirements
3. Wait up to 48 hours for full propagation

### Login Not Working

1. Verify environment variables are set correctly in Vercel
2. Check Supabase project is online
3. Confirm user accounts exist in Supabase Auth

---

## Vercel Free Tier Limits

✅ Unlimited deployments
✅ Unlimited bandwidth (fair use)
✅ Automatic HTTPS/SSL
✅ Global CDN
✅ Suitable for production use

**Only upgrade if you need:**
- Team collaboration features
- Advanced analytics
- Passworded preview deployments

---

## Summary

✅ GitHub repository: https://github.com/buge4/veriton-genesis
✅ Deployed on: Vercel
✅ Live at: https://veriton.io
✅ Backend: Supabase (xprtzodwutgskpdvyxwn)
✅ Auto-deploy: Enabled (push to main branch)

**No more ZIP packages. No more manual deployments. Just push code and it goes live.**

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Repository: https://github.com/buge4/veriton-genesis
