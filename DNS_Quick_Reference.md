# DNS Configuration Quick Reference
**Domain**: veriton.io → **Target**: buge4.github.io

---

## 🔑 Essential DNS Records

### Primary Configuration (CNAME - Recommended)
```
Type: CNAME
Host: @
Value: buge4.github.io
TTL: 300 seconds

Type: CNAME
Host: www
Value: buge4.github.io
TTL: 300 seconds
```

### Alternative Configuration (A Records)
```
Type: A
Host: @
Value: 185.199.108.153
TTL: 300

Type: A
Host: @
Value: 185.199.109.153
TTL: 300

Type: A
Host: @
Value: 185.199.110.153
TTL: 300

Type: A
Host: @
Value: 185.199.111.153
TTL: 300
```

---

## ✅ Verification Commands

```bash
# Test DNS resolution
dig veriton.io CNAME
dig veriton.io A

# Test website accessibility
curl -I https://veriton.io
curl -I https://www.veriton.io

# Check SSL certificate
curl -I https://veriton.io | grep -i "https\|ssl\|certificate"
```

---

## 📊 Current Status

- **Website**: ✅ LIVE at https://veriton.io
- **DNS**: ✅ Resolving to GitHub Pages (5.9.108.218)
- **SSL**: ✅ HTTPS working
- **Issues**: ⚠️ CNAME file missing in repository, workflow failures

---

## 🚨 Critical Issues

### 1. Missing CNAME File
- Repository needs CNAME file with content: `veriton.io`
- Required for proper GitHub Pages custom domain

### 2. Deployment Issues
- Latest GitHub Actions workflow failed
- May need manual intervention

---

## 🔧 Quick Setup Steps

1. **Add CNAME record** to veriton.io DNS:
   - @ → buge4.github.io
   - www → buge4.github.io

2. **Verify propagation**:
   - Use https://dnschecker.org/#CNAME/veriton.io
   - Wait up to 24 hours for full propagation

3. **Check GitHub Pages settings**:
   - Ensure Custom domain is set to veriton.io
   - Enable HTTPS

---

## 📞 Repository Info

- **Repository**: https://github.com/buge4/buge4.github.io
- **Owner**: buge4
- **Branch**: main
- **Status**: Active

---

**Quick Reference Guide v1.0 - 2025-10-24 03:18:30**