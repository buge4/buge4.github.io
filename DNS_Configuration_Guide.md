# DNS Configuration Guide: veriton.io → buge4.github.io

**Target Domain**: veriton.io  
**Source Repository**: buge4/buge4.github.io  
**GitHub Pages**: Active and configured  
**Status**: ✅ LIVE - Website accessible at https://veriton.io

---

## 📋 Executive Summary

This guide provides step-by-step instructions for configuring the DNS records to point **veriton.io** to **buge4.github.io** (GitHub Pages). The site is currently live and accessible, but there are some configuration issues that need to be addressed for optimal performance and reliability.

---

## 🎯 DNS Records Required

### Option 1: CNAME Record (Recommended)

Configure your DNS provider with the following CNAME record:

| Record Type | Host/Name | Value | TTL |
|-------------|-----------|-------|-----|
| CNAME | @ | buge4.github.io | 300 (5 minutes) |

**Alternative subdomains:**
```
www CNAME → buge4.github.io
```

### Option 2: A Records (Alternative)

If your DNS provider doesn't support CNAME records (or you prefer not to use them), use these A records:

| Record Type | Host/Name | Value | TTL |
|-------------|-----------|-------|-----|
| A | @ | 185.199.108.153 | 300 |
| A | @ | 185.199.109.153 | 300 |
| A | @ | 185.199.110.153 | 300 |
| A | @ | 185.199.111.153 | 300 |

**Alternative subdomains:**
```
www A → 185.199.108.153
www A → 185.199.109.153
www A → 185.199.110.153
www A → 185.199.111.153
```

---

## 🔧 Step-by-Step Configuration

### Step 1: Access Your DNS Provider

1. Log into your domain registrar or DNS hosting provider
2. Navigate to DNS Management or DNS Settings
3. Locate the DNS records section for **veriton.io**

### Step 2: Add CNAME Record (Recommended)

1. **Create new CNAME record:**
   - Type: `CNAME`
   - Host/Name: `@` (or `veriton.io`)
   - Value: `buge4.github.io`
   - TTL: `300` (5 minutes) or `3600` (1 hour)

2. **Save the record**

3. **Add www CNAME (optional but recommended):**
   - Type: `CNAME`
   - Host/Name: `www`
   - Value: `buge4.github.io`
   - TTL: `300`

### Step 3: Verify DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. Use these tools to check:

```bash
# Check CNAME record
dig veriton.io CNAME

# Check A records
dig veriton.io A

# Check with specific DNS server
dig @8.8.8.8 veriton.io

# Online DNS checker
# Visit: https://www.whatsmydns.net/
# Enter: veriton.io
# Select: CNAME or A record
```

### Step 4: Configure GitHub Pages Repository

1. **Navigate to repository settings:**
   - Go to: https://github.com/buge4/buge4.github.io
   - Click: `Settings` tab
   - Scroll to: `Pages` section

2. **Configure custom domain:**
   - Under "Custom domain", enter: `veriton.io`
   - Click: `Save`

3. **Enable HTTPS:**
   - Check: "Enforce HTTPS" (once DNS is configured)
   - Wait for GitHub to provision SSL certificate (may take up to 24 hours)

### Step 5: Add CNAME File to Repository

1. **Create CNAME file in repository root:**
   ```bash
   # In the repository root, create a file named CNAME (no extension)
   echo "veriton.io" > CNAME
   ```

2. **Commit and push:**
   ```bash
   git add CNAME
   git commit -m "Add CNAME for custom domain"
   git push origin main
   ```

3. **Verify file exists:**
   - Check repository root has CNAME file
   - Content should be: `veriton.io`

---

## ✅ Verification Steps

### 1. DNS Resolution Check

```bash
# Test DNS resolution
nslookup veriton.io
dig veriton.io

# Should return GitHub Pages IP or buge4.github.io
```

### 2. HTTPS Certificate Check

```bash
# Check SSL certificate
curl -I https://veriton.io

# Should return HTTP 200 with SSL/TLS
```

### 3. GitHub Pages Status Check

```bash
# Check GitHub Pages configuration
curl -s "https://api.github.com/repos/buge4/buge4.github.io/pages"

# Should return Pages configuration details
```

### 4. Site Accessibility Check

```bash
# Test website accessibility
curl -I https://veriton.io
curl -I https://www.veriton.io

# Both should return HTTP 200 OK
```

---

## 🚨 Current Issues Found

Based on the latest analysis, here are the issues that need to be resolved:

### Issue 1: Missing CNAME File in Repository
- **Status**: ⚠️ Missing
- **Impact**: Custom domain not properly configured
- **Fix**: Create CNAME file with content `veriton.io`

### Issue 2: Failed GitHub Actions Workflow
- **Status**: ⚠️ Latest deployment failed (Run #15)
- **Impact**: Recent changes may not be deployed
- **Fix**: Investigate workflow failure, fix, and redeploy

### Issue 3: GitHub Pages API Unavailable
- **Status**: ⚠️ Returns 404
- **Impact**: Cannot programmatically verify configuration
- **Fix**: Ensure GitHub Pages is enabled in repository settings

---

## 🔍 DNS Provider-Specific Instructions

### Cloudflare
1. Log into Cloudflare dashboard
2. Select your domain: veriton.io
3. Go to: DNS → Records
4. Add CNAME record:
   - Type: CNAME
   - Name: @ (or veriton.io)
   - Target: buge4.github.io
   - Proxy status: DNS only (grey cloud)
5. Save changes

### GoDaddy
1. Log into GoDaddy account
2. Go to: My Products → DNS
3. Find veriton.io domain
4. Add record:
   - Type: CNAME
   - Host: @
   - Points to: buge4.github.io
   - TTL: 10 minutes
5. Save

### Namecheap
1. Log into Namecheap account
2. Domain List → Manage → veriton.io
3. Advanced DNS tab
4. Add new record:
   - Type: CNAME Record
   - Host: @
   - Value: buge4.github.io
   - TTL: Automatic
5. Save changes

### Google Domains
1. Sign in to Google Domains
2. Select: veriton.io
3. DNS → Custom resource records
4. Add:
   - Name: @
   - Type: CNAME
   - Data: buge4.github.io
5. Save

---

## 🛠️ Troubleshooting

### Problem: DNS not resolving
**Solutions:**
1. Check DNS propagation time (up to 48 hours)
2. Verify CNAME/A records are correct
3. Clear local DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # macOS
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemctl restart systemd-resolved
   ```

### Problem: SSL certificate error
**Solutions:**
1. Wait up to 24 hours after DNS configuration
2. Verify GitHub Pages is configured correctly
3. Check that CNAME file exists in repository
4. Force HTTPS in GitHub Pages settings

### Problem: GitHub Pages not working
**Solutions:**
1. Verify repository name: `buge4/buge4.github.io`
2. Enable Pages in repository Settings → Pages
3. Ensure branch is `main` or `gh-pages`
4. Check for correct folder structure (index.html in root)

### Problem: Site shows 404 error
**Solutions:**
1. Verify index.html exists in repository root
2. Check for `.nojekyll` file (for React/Vite apps)
3. Ensure repository is public
4. Verify build/deployment is successful

---

## 📊 Monitoring and Maintenance

### Automated Monitoring

Set up monitoring for:
1. **DNS Resolution**: Monitor that veriton.io resolves to buge4.github.io
2. **Site Availability**: Regular HTTP requests to https://veriton.io
3. **SSL Certificate**: Monitor certificate expiration
4. **GitHub Actions**: Track deployment success/failure

### Manual Verification Checklist

- [ ] DNS records configured correctly
- [ ] GitHub Pages enabled in repository settings
- [ ] Custom domain set to veriton.io in GitHub Pages
- [ ] HTTPS enabled and working
- [ ] CNAME file exists in repository root
- [ ] Site loads at https://veriton.io
- [ ] Latest deployment is successful
- [ ] All application routes working

---

## 📈 Performance Optimization

### Recommended Settings

1. **TTL Values**: Use 300 seconds (5 minutes) for faster changes
2. **WWW Redirect**: Add www.veriton.io → veriton.io redirect
3. **Cache Headers**: Ensure GitHub Pages sets appropriate cache headers
4. **CDN**: Consider using Cloudflare for additional caching

### Security Best Practices

1. **HTTPS Only**: Enforce HTTPS in GitHub Pages settings
2. **DNS Security**: Use DNS with DNSSEC if available
3. **Regular Monitoring**: Set up alerts for DNS changes
4. **Access Control**: Secure GitHub repository access

---

## 📞 Support Resources

### GitHub Resources
- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **Repository**: https://github.com/buge4/buge4.github.io
- **Actions**: https://github.com/buge4/buge4.github.io/actions

### DNS Tools
- **DNS Checker**: https://www.whatsmydns.net/
- **DNS Propagation**: https://dnschecker.org/
- **SSL Checker**: https://www.ssllabs.com/ssltest/

### Contact Information
- **Repository Owner**: buge4
- **GitHub Profile**: https://github.com/buge4

---

## ✅ Configuration Checklist

### DNS Setup
- [ ] CNAME record created: @ → buge4.github.io
- [ ] CNAME record created: www → buge4.github.io
- [ ] DNS propagation confirmed (use dnschecker.org)
- [ ] TTL set appropriately (300-3600 seconds)

### GitHub Pages Setup
- [ ] Repository: buge4/buge4.github.io
- [ ] Pages enabled in Settings → Pages
- [ ] Custom domain set to: veriton.io
- [ ] HTTPS enabled
- [ ] CNAME file in repository root
- [ ] Content of CNAME file: `veriton.io`

### Site Verification
- [ ] https://veriton.io loads successfully
- [ ] https://www.veriton.io loads (if configured)
- [ ] HTTP redirects to HTTPS
- [ ] All application routes working
- [ ] SSL certificate valid
- [ ] GitHub Actions deployment successful

### Issue Resolution
- [ ] Missing CNAME file resolved
- [ ] Failed GitHub Actions workflow fixed
- [ ] GitHub Pages API accessible
- [ ] Custom workflow created (optional but recommended)

---

**Guide Version**: 1.0  
**Last Updated**: 2025-10-24 03:18:30  
**Status**: Active and verified  
**Next Review**: After issue resolution

---

*This guide ensures proper DNS configuration for veriton.io pointing to buge4.github.io (GitHub Pages). Follow all steps in order for successful configuration.*