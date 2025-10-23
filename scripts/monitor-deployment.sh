#!/bin/bash

# GitHub Pages Deployment Monitoring Script
# Created: 2025-10-24 03:03:57
# Purpose: Monitor deployment status and troubleshoot issues

set -e

# Configuration
REPO_OWNER="buge4"
REPO_NAME="buge4.github.io"
SITE_URL="https://veriton.io"
MONITOR_DURATION=300  # 5 minutes
CHECK_INTERVAL=10     # Check every 10 seconds

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Function to get latest GitHub Actions run
get_latest_workflow_run() {
    curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?per_page=1" | \
    grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4
}

# Function to get workflow run conclusion
get_workflow_conclusion() {
    curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?per_page=1" | \
    grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4
}

# Function to check site headers
check_site_headers() {
    curl -sI "$SITE_URL" | grep -E "(Last-Modified|X-GitHub-Request-Id|HTTP)"
}

# Function to check site accessibility
check_site_accessibility() {
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
    if [ "$status_code" = "200" ]; then
        return 0
    else
        return 1
    fi
}

# Function to test SPA routing
test_spa_routing() {
    local test_urls=(
        "$SITE_URL/admin"
        "$SITE_URL/business"
        "$SITE_URL/admin/users"
    )
    
    local failed_routes=0
    
    for url in "${test_urls[@]}"; do
        print_info "Testing route: $url"
        
        # Check if route returns 200 (should be handled by 404.html -> index.html)
        local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        
        if [ "$status_code" = "200" ]; then
            print_status "$url - OK"
        else
            print_error "$url - Failed (Status: $status_code)"
            failed_routes=$((failed_routes + 1))
        fi
        
        sleep 1
    done
    
    return $failed_routes
}

# Function to monitor GitHub Actions
monitor_workflow() {
    print_info "Monitoring GitHub Actions workflow..."
    
    local elapsed=0
    
    while [ $elapsed -lt $MONITOR_DURATION ]; do
        print_info "Checking workflow status... ($elapsed seconds elapsed)"
        
        local status=$(get_latest_workflow_run)
        local conclusion=$(get_workflow_conclusion)
        
        print_info "Workflow Status: $status"
        
        if [ -n "$conclusion" ]; then
            print_info "Workflow Conclusion: $conclusion"
            
            if [ "$conclusion" = "success" ]; then
                print_status "Deployment successful!"
                return 0
            elif [ "$conclusion" = "failure" ]; then
                print_error "Deployment failed!"
                return 1
            fi
        fi
        
        sleep $CHECK_INTERVAL
        elapsed=$((elapsed + CHECK_INTERVAL))
    done
    
    print_warning "Monitoring timeout reached"
    return 2
}

# Function to monitor site changes
monitor_site_changes() {
    print_info "Monitoring site changes..."
    
    local last_modified=""
    local last_github_id=""
    local checks=0
    
    while [ $checks -lt 30 ]; do
        print_info "Checking site headers... (Check $checks/30)"
        
        local headers=$(check_site_headers)
        local current_modified=$(echo "$headers" | grep "Last-Modified" | cut -d' ' -f2-)
        local current_github_id=$(echo "$headers" | grep "X-GitHub-Request-Id" | cut -d':' -f2-)
        
        if [ -n "$current_modified" ] && [ "$current_modified" != "$last_modified" ]; then
            print_status "Site updated! Last-Modified: $current_modified"
            last_modified="$current_modified"
        fi
        
        if [ -n "$current_github_id" ] && [ "$current_github_id" != "$last_github_id" ]; then
            print_status "New GitHub deployment detected! Request ID: $current_github_id"
            last_github_id="$current_github_id"
        fi
        
        sleep 10
        checks=$((checks + 1))
    done
}

# Function to generate monitoring report
generate_monitoring_report() {
    local report_file="deployment-monitoring-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# Deployment Monitoring Report
Generated: $(date)
Site URL: $SITE_URL
Repository: $REPO_OWNER/$REPO_NAME

## Site Accessibility
EOF

    if check_site_accessibility; then
        echo "- Status: ✅ Accessible" >> "$report_file"
    else
        echo "- Status: ❌ Not accessible" >> "$report_file"
    fi

    echo -e "\n## Site Headers" >> "$report_file"
    check_site_headers >> "$report_file"

    echo -e "\n## Latest Workflow Run" >> "$report_file"
    echo "- Status: $(get_latest_workflow_run)" >> "$report_file"
    echo "- Conclusion: $(get_workflow_conclusion)" >> "$report_file"

    cat >> "$report_file" << EOF

## Recommendations
1. Wait for GitHub Actions to complete
2. Verify site accessibility
3. Test SPA routing with direct URL access
4. Check browser console for errors
5. Monitor real-time features

---
Report generated: $(date)
EOF

    print_status "Monitoring report generated: $report_file"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -m, --monitor          Monitor deployment (default)"
    echo "  -t, --test-routes      Test SPA routing"
    echo "  -h, --headers          Check site headers"
    echo "  -s, --status           Check site accessibility"
    echo "  -r, --report           Generate monitoring report"
    echo "  -h, --help             Show this help"
    echo
    echo "Examples:"
    echo "  $0                     Monitor deployment"
    echo "  $0 --test-routes       Test SPA routing"
    echo "  $0 --report            Generate report"
}

# Main function
main() {
    case "${1:-}" in
        -m|--monitor)
            print_info "Starting deployment monitoring..."
            monitor_workflow
            monitor_site_changes
            ;;
        -t|--test-routes)
            print_info "Testing SPA routing..."
            test_spa_routing
            ;;
        -h|--headers)
            print_info "Checking site headers..."
            check_site_headers
            ;;
        -s|--status)
            print_info "Checking site accessibility..."
            if check_site_accessibility; then
                print_status "Site is accessible"
            else
                print_error "Site is not accessible"
            fi
            ;;
        -r|--report)
            generate_monitoring_report
            ;;
        --help|-h)
            show_usage
            ;;
        *)
            print_info "GitHub Pages Deployment Monitor"
            print_info "Default: Monitor deployment workflow"
            echo
            monitor_workflow
            ;;
    esac
}

# Check if jq is available for JSON parsing
if ! command -v jq &> /dev/null; then
    print_warning "jq not found - some features may not work properly"
    print_info "Install jq for better JSON parsing: apt-get install jq"
fi

# Run main function
main "$@"