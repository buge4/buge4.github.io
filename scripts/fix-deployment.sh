#!/bin/bash

# GitHub Pages Deployment Issue Resolution Script
# Created: 2025-10-24 03:03:57
# Purpose: Fix common GitHub Pages deployment issues

set -e

echo "🔧 GitHub Pages Deployment Fix Tool"
echo "===================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in a React/Vite project
check_project_type() {
    if [ -f "package.json" ]; then
        if grep -q "vite" package.json; then
            print_status "Vite project detected"
            return 0
        elif grep -q "react" package.json; then
            print_status "React project detected"
            return 0
        else
            print_warning "Unknown project type, but package.json found"
            return 0
        fi
    else
        print_error "No package.json found - not in project root"
        exit 1
    fi
}

# Fix SPA routing issues
fix_spa_routing() {
    print_info "Checking SPA routing configuration..."
    
    if [ ! -f "dist/404.html" ]; then
        print_info "Creating 404.html for SPA routing..."
        create_404_html
    else
        print_status "404.html already exists"
    fi
    
    if [ ! -f "dist/.nojekyll" ]; then
        print_info "Creating .nojekyll to disable Jekyll processing..."
        touch dist/.nojekyll
        print_status ".nojekyll created"
    else
        print_status ".nojekyll already exists"
    fi
}

# Create 404.html for SPA routing
create_404_html() {
    cat > dist/404.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Redirecting...</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>
</head>
<body>
</body>
</html>
EOF
    print_status "404.html created with SPA routing logic"
}

# Fix GitHub Actions workflow
fix_github_actions() {
    print_info "Checking GitHub Actions workflow..."
    
    if [ ! -d ".github/workflows" ]; then
        print_info "Creating .github/workflows directory..."
        mkdir -p .github/workflows
    fi
    
    if [ ! -f ".github/workflows/deploy.yml" ]; then
        print_info "Creating GitHub Actions workflow..."
        create_github_workflow
    else
        print_status "GitHub Actions workflow already exists"
    fi
}

# Create GitHub Actions workflow
create_github_workflow() {
    cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF
    print_status "GitHub Actions workflow created"
}

# Fix build configuration
fix_build_config() {
    print_info "Checking build configuration..."
    
    # Check vite.config.ts
    if [ -f "vite.config.ts" ]; then
        print_status "vite.config.ts found"
        
        # Ensure base path is correct for GitHub Pages
        if ! grep -q "base:" vite.config.ts; then
            print_info "Adding base configuration to vite.config.ts..."
            add_vite_base_config
        fi
    else
        print_warning "vite.config.ts not found - creating basic configuration..."
        create_vite_config
    fi
}

# Add base configuration to vite.config.ts
add_vite_base_config() {
    print_info "Adding base path configuration..."
    # This would require parsing the file, so we'll just warn
    print_warning "Please manually add 'base: \"./\"' to your vite.config.ts if deploying to GitHub Pages subdirectory"
}

# Create basic vite config
create_vite_config() {
    cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for GitHub Pages
})
EOF
    print_status "Basic vite.config.ts created"
}

# Verify deployment readiness
verify_deployment() {
    print_info "Verifying deployment readiness..."
    
    local issues=0
    
    # Check dist directory
    if [ ! -d "dist" ]; then
        print_error "dist directory missing - run 'npm run build' first"
        issues=$((issues + 1))
    else
        print_status "dist directory exists"
    fi
    
    # Check required files
    local required_files=("index.html" "404.html" ".nojekyll")
    for file in "${required_files[@]}"; do
        if [ -f "dist/$file" ]; then
            print_status "dist/$file exists"
        else
            print_error "dist/$file missing"
            issues=$((issues + 1))
        fi
    done
    
    # Check assets
    if [ -d "dist/assets" ]; then
        local asset_count=$(ls -1 dist/assets | wc -l)
        print_status "Assets directory contains $asset_count files"
    else
        print_error "Assets directory missing"
        issues=$((issues + 1))
    fi
    
    if [ $issues -eq 0 ]; then
        print_status "Deployment readiness check passed!"
        return 0
    else
        print_error "Found $issues issues - please fix them before deployment"
        return 1
    fi
}

# Generate deployment report
generate_report() {
    print_info "Generating deployment report..."
    
    cat > deployment-report.md << EOF
# Deployment Report
Generated: $(date)

## Project Information
- Project Type: $(grep -q '"vite"' package.json && echo "Vite" || echo "Unknown")
- Build Directory: $([ -d "dist" ] && echo "✅ Present" || echo "❌ Missing")
- Node Version: $(node --version 2>/dev/null || echo "Not found")

## Build Files
EOF

    if [ -d "dist" ]; then
        echo "### Dist Directory Contents" >> deployment-report.md
        ls -la dist/ >> deployment-report.md
        
        if [ -d "dist/assets" ]; then
            echo -e "\n### Assets Directory" >> deployment-report.md
            ls -la dist/assets/ >> deployment-report.md
        fi
    fi
    
    cat >> deployment-report.md << EOF

## GitHub Pages Configuration
- Workflow File: $([ -f ".github/workflows/deploy.yml" ] && echo "✅ Present" || echo "❌ Missing")
- 404.html: $([ -f "dist/404.html" ] && echo "✅ Present" || echo "❌ Missing")
- .nojekyll: $([ -f "dist/.nojekyll" ] && echo "✅ Present" || echo "❌ Missing")

## Next Steps
1. Commit all changes
2. Push to GitHub: \`git push origin main\`
3. Monitor GitHub Actions
4. Verify deployment at your GitHub Pages URL
EOF

    print_status "Deployment report generated: deployment-report.md"
}

# Main execution
main() {
    echo
    print_info "Starting GitHub Pages deployment fixes..."
    echo
    
    # Check project type
    check_project_type
    echo
    
    # Apply fixes
    fix_spa_routing
    echo
    
    fix_github_actions
    echo
    
    fix_build_config
    echo
    
    # Verify everything is ready
    if verify_deployment; then
        echo
        print_status "All fixes applied successfully!"
        echo
        
        # Generate report
        generate_report
        echo
        
        print_info "Next steps:"
        echo "1. Commit changes: git add . && git commit -m 'Fix GitHub Pages deployment issues'"
        echo "2. Push to GitHub: git push origin main"
        echo "3. Monitor deployment in GitHub Actions"
        echo "4. Verify at your GitHub Pages URL"
    else
        echo
        print_error "Some issues remain. Please fix them and run this script again."
        exit 1
    fi
}

# Run main function
main "$@"