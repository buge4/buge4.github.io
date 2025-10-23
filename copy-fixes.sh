#!/bin/bash

# Copy deployment fixes to both dist directories
# This ensures both veriton-tvrf and veriton-domain-deployment have all fixes

echo "📦 Copying deployment fixes to dist directories..."
echo

# Source and destination directories
SOURCE_DIR="/workspace"
DESTINATIONS=(
    "/workspace/veriton-tvrf/dist"
    "/workspace/veriton-domain-deployment/dist"
)

# Files to copy
FILES_TO_COPY=(
    ".htaccess"
    "netlify.toml"
    "vercel.json"
)

for DEST in "${DESTINATIONS[@]}"; do
    echo "🔧 Processing: $DEST"
    
    # Copy configuration files
    for FILE in "${FILES_TO_COPY[@]}"; do
        if [ -f "$SOURCE_DIR/$FILE" ]; then
            cp "$SOURCE_DIR/$FILE" "$DEST/"
            echo "  ✅ Copied $FILE"
        fi
    done
    
    # Verify SPA routing files exist
    echo "  🔍 Verifying SPA routing files..."
    
    if [ -f "$DEST/404.html" ]; then
        echo "    ✅ 404.html exists ($(wc -c < "$DEST/404.html") bytes)"
    else
        echo "    ❌ 404.html missing"
    fi
    
    if [ -f "$DEST/.nojekyll" ]; then
        echo "    ✅ .nojekyll exists"
    else
        echo "    ❌ .nojekyll missing"
    fi
    
    # Check assets
    if [ -d "$DEST/assets" ]; then
        ASSET_COUNT=$(ls -1 "$DEST/assets" | wc -l)
        echo "    ✅ Assets directory contains $ASSET_COUNT files"
    else
        echo "    ❌ Assets directory missing"
    fi
    
    echo
done

echo "✅ Deployment fixes copied to all dist directories!"
echo
echo "📋 Summary:"
echo "  - SPA routing: 404.html + .nojekyll"
echo "  - Platform configs: .htaccess, netlify.toml, vercel.json"
echo "  - Build verification scripts available"
echo "  - Monitoring scripts ready"
echo
echo "🚀 Next steps:"
echo "  1. Commit and push to GitHub"
echo "  2. Monitor deployment with: bash scripts/monitor-deployment.sh"
echo "  3. Verify at https://veriton.io"