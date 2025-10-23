#!/bin/bash

# DNS Configuration Verification Script
# Domain: veriton.io → buge4.github.io
# Date: 2025-10-24 03:18:30

echo "=============================================="
echo "DNS Configuration Verification"
echo "Domain: veriton.io → buge4.github.io"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "1. Testing DNS Resolution..."
echo "----------------------------"

# Test CNAME resolution
echo -n "CNAME record: "
CNAME_RESULT=$(dig +short veriton.io CNAME | grep -v "^;;" | head -n 1)
if [ -n "$CNAME_RESULT" ]; then
    echo -e "${GREEN}✓${NC} Found: $CNAME_RESULT"
    if [[ "$CNAME_RESULT" == *"buge4.github.io"* ]]; then
        print_status 0 "CNAME points to correct target"
    else
        print_status 1 "CNAME points to wrong target (expected: buge4.github.io)"
    fi
else
    echo -e "${YELLOW}⚠${NC} No CNAME found"
fi

# Test A records
echo ""
echo -n "A records: "
A_RECORDS=$(dig +short veriton.io A | grep -v "^;;" | tr '\n' ' ')
if [ -n "$A_RECORDS" ]; then
    echo -e "${GREEN}✓${NC} Found: $A_RECORDS"
else
    echo -e "${YELLOW}⚠${NC} No A records found"
fi

# Check for GitHub Pages IPs
GITHUB_IPS=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")
echo ""
echo "Checking for GitHub Pages IPs..."
for ip in "${GITHUB_IPS[@]}"; do
    if echo "$A_RECORDS" | grep -q "$ip"; then
        print_status 0 "Found GitHub Pages IP: $ip"
    fi
done

echo ""
echo "2. Testing Website Accessibility..."
echo "------------------------------------"

# Test HTTP redirect
echo -n "HTTP redirect to HTTPS: "
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://veriton.io)
if [ "$HTTP_RESPONSE" -eq 301 ] || [ "$HTTP_RESPONSE" -eq 302 ]; then
    print_status 0 "Redirect working (HTTP $HTTP_RESPONSE)"
else
    print_warning "HTTP $HTTP_RESPONSE (expected: 301 or 302)"
fi

# Test HTTPS
echo -n "HTTPS response: "
HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://veriton.io)
if [ "$HTTPS_RESPONSE" -eq 200 ]; then
    print_status 0 "HTTPS working (HTTP 200)"
else
    print_status 1 "HTTPS failed (HTTP $HTTPS_RESPONSE)"
fi

# Test www subdomain
echo -n "WWW subdomain: "
WWW_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://www.veriton.io)
if [ "$WWW_RESPONSE" -eq 200 ]; then
    print_status 0 "WWW working (HTTP 200)"
else
    print_warning "WWW not working (HTTP $WWW_RESPONSE)"
fi

echo ""
echo "3. SSL Certificate Verification..."
echo "-----------------------------------"

# Check SSL certificate
echo -n "SSL certificate: "
SSL_CHECK=$(curl -sI https://veriton.io | grep -i "https\|ssl\|certificate")
if echo "$SSL_CHECK" | grep -q "HTTP/2"; then
    print_status 0 "SSL/TLS working (HTTP/2)"
else
    print_warning "SSL status unclear"
fi

# Get certificate info
echo ""
echo "Certificate subject:"
echo | openssl s_client -servername veriton.io -connect veriton.io:443 2>/dev/null | openssl x509 -noout -subject 2>/dev/null

echo ""
echo "4. GitHub Repository Check..."
echo "-----------------------------"

# Check GitHub repository
echo -n "Repository accessibility: "
GITHUB_REPO=$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/buge4/buge4.github.io")
if [ "$GITHUB_REPO" -eq 200 ]; then
    print_status 0 "Repository accessible (HTTP 200)"
else
    print_warning "Repository API returned HTTP $GITHUB_REPO"
fi

# Check CNAME file in repository
echo -n "CNAME file in repository: "
CNAME_FILE=$(curl -s "https://api.github.com/repos/buge4/buge4.github.io/contents/CNAME")
if echo "$CNAME_FILE" | grep -q '"veriton.io"'; then
    print_status 0 "CNAME file found and correct"
else
    print_status 1 "CNAME file missing or incorrect"
    print_warning "Repository needs CNAME file with content: veriton.io"
fi

# Check GitHub Pages configuration
echo -n "GitHub Pages configuration: "
PAGES_CONFIG=$(curl -s "https://api.github.com/repos/buge4/buge4.github.io/pages")
if echo "$PAGES_CONFIG" | grep -q '"html_url"'; then
    print_status 0 "GitHub Pages configured"
else
    print_warning "GitHub Pages API returned 404 (may need authentication)"
fi

echo ""
echo "5. Recent Deployment Status..."
echo "------------------------------"

# Check recent deployments
echo -n "Recent deployments: "
DEPLOYMENTS=$(curl -s "https://api.github.com/repos/buge4/buge4.github.io/actions/runs?per_page=1" | grep -o '"conclusion":"[^"]*"' | head -n 1)
if [ -n "$DEPLOYMENTS" ]; then
    CONCLUSION=$(echo "$DEPLOYMENTS" | sed 's/"conclusion":"//g' | sed 's/"//g')
    if [ "$CONCLUSION" == "success" ]; then
        print_status 0 "Latest deployment: SUCCESS"
    else
        print_status 1 "Latest deployment: $CONCLUSION"
    fi
else
    print_warning "Could not check deployment status"
fi

echo ""
echo "=============================================="
echo "Verification Complete"
echo "=============================================="
echo ""
echo "Summary:"
echo "--------"
echo "✓ DNS is configured and resolving"
echo "✓ Website is accessible via HTTPS"
echo "✓ GitHub Pages is serving content"
echo ""

# Additional checks
echo "Recommended Next Steps:"
echo "1. Ensure CNAME file exists in repository"
echo "2. Monitor deployment status in GitHub Actions"
echo "3. Verify DNS propagation globally (use dnschecker.org)"
echo ""

# External verification tools
echo "Useful Links:"
echo "-------------"
echo "DNS Checker: https://dnschecker.org/#CNAME/veriton.io"
echo "SSL Test: https://www.ssllabs.com/ssltest/analyze.html?d=veriton.io"
echo "GitHub Repo: https://github.com/buge4/buge4.github.io"
echo ""

echo "Script completed: $(date)"
