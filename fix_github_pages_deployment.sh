#!/bin/bash

# GitHub Pages Deployment Fix Script
# Purpose: Copy built files to dist directory for GitHub Pages deployment
# Date: 2025-10-24 04:10:19

set -e  # Exit on error

echo "================================================"
echo "GitHub Pages Deployment Fix"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -d "dist" ]; then
    echo -e "${RED}ERROR: Not in the correct directory. Must run from workspace root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking current directory structure...${NC}"
echo "Root directory contents:"
ls -la | head -10
echo ""
echo "Dist directory contents (BEFORE):"
ls -la dist/ || echo "dist/ directory empty or missing files"
echo ""

echo -e "${YELLOW}Step 2: Copying built files to dist directory...${NC}"

# Copy essential files
echo "Copying index.html..."
cp index.html dist/

echo "Copying 404.html..."
cp 404.html dist/

echo "Copying .nojekyll..."
cp .nojekyll dist/

echo "Copying CNAME..."
cp CNAME dist/

echo "Copying assets directory..."
cp -r assets dist/

echo "Copying configuration files..."
cp netlify.toml dist/ 2>/dev/null || echo "  (netlify.toml not found, skipping)"
cp vercel.json dist/ 2>/dev/null || echo "  (vercel.json not found, skipping)"
cp .htaccess dist/ 2>/dev/null || echo "  (.htaccess not found, skipping)"

echo ""
echo -e "${YELLOW}Step 3: Verifying dist directory contents...${NC}"
echo "Dist directory contents (AFTER):"
ls -la dist/
echo ""

echo "Assets directory:"
ls -la dist/assets/ 2>/dev/null || echo "  Assets directory not found!"

echo ""
echo -e "${YELLOW}Step 4: Checking file sizes...${NC}"
echo "Key files:"
echo "  dist/index.html: $(wc -c < dist/index.html 2>/dev/null || echo 'MISSING') bytes"
echo "  dist/404.html: $(wc -c < dist/404.html 2>/dev/null || echo 'MISSING') bytes"
echo "  dist/assets/index-BLxo-SJT.js: $(wc -c < dist/assets/index-BLxo-SJT.js 2>/dev/null || echo 'MISSING') bytes"
echo "  dist/assets/index-yoE7kPvF.css: $(wc -c < dist/assets/index-yoE7kPvF.css 2>/dev/null || echo 'MISSING') bytes"
echo "  dist/CNAME: $(wc -c < dist/CNAME 2>/dev/null || echo 'MISSING') bytes"

echo ""
echo -e "${YELLOW}Step 5: Preparing git commit...${NC}"

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "Changes detected. Ready to commit:"
    git status --porcelain | head -20
    
    echo ""
    read -p "Do you want to commit and push these changes? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Committing changes...${NC}"
        git add dist/
        git commit -m "Deploy: Copy built application files to dist directory for GitHub Pages"
        
        echo ""
        echo -e "${YELLOW}Pushing to repository...${NC}"
        git push origin main
        
        echo ""
        echo -e "${GREEN}✓ Successfully pushed to repository!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Monitor GitHub Actions at: https://github.com/buge4/buge4.github.io/actions"
        echo "2. Check deployment status at: https://veriton.io"
        echo "3. Verify site accessibility in 2-3 minutes"
        
    else
        echo -e "${YELLOW}Changes not committed. You can manually commit later:${NC}"
        echo "  git add dist/"
        echo "  git commit -m 'Deploy: Copy built application files to dist directory'"
        echo "  git push origin main"
    fi
else
    echo -e "${YELLOW}No changes detected. Files may already be up to date.${NC}"
fi

echo ""
echo "================================================"
echo "Fix Script Complete"
echo "================================================"
