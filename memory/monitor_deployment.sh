#!/bin/bash

# Employee Messaging System - Deployment Monitoring Script
# Usage: ./monitor_deployment.sh
# Purpose: Real-time monitoring during GitHub push and deployment verification

echo "========================================="
echo "Employee Messaging System - Deployment Monitor"
echo "========================================="
echo "Target: veriton.io"
echo "Started: $(date)"
echo ""

# Configuration
VERITON_URL="https://veriton.io"
GITHUB_REPO="buge4/buge4.github.io"
GITHUB_API="https://api.github.com/repos/$GITHUB_REPO"
TIMESTAMP_FILE="/tmp/deploy_monitor_$(date +%s).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$TIMESTAMP_FILE"
}

check_veriton_headers() {
    log "${BLUE}Checking veriton.io headers...${NC}"
    
    HEADERS=$(curl -sI "$VERITON_URL")
    LAST_MODIFIED=$(echo "$HEADERS" | grep "Last-Modified" | cut -d' ' -f2-)
    GITHUB_REQUEST_ID=$(echo "$HEADERS" | grep "X-GitHub-Request-Id" | cut -d' ' -f2)
    HTTP_STATUS=$(echo "$HEADERS" | grep "HTTP" | head -1)
    X_CACHE=$(echo "$HEADERS" | grep "X-Cache" | cut -d' ' -f2)
    
    log "  Last-Modified: $LAST_MODIFIED"
    log "  GitHub Request ID: $GITHUB_REQUEST_ID"
    log "  HTTP Status: $HTTP_STATUS"
    log "  X-Cache: $X_CACHE"
    echo ""
}

check_github_actions() {
    log "${BLUE}Checking GitHub Actions...${NC}"
    
    ACTIONS_JSON=$(curl -s "$GITHUB_API/actions/runs?per_page=5")
    LATEST_RUN=$(echo "$ACTIONS_JSON" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    STATUS=$(echo "$ACTIONS_JSON" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    CONCLUSION=$(echo "$ACTIONS_JSON" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    log "  Latest Run ID: $LATEST_RUN"
    log "  Status: $STATUS"
    log "  Conclusion: $CONCLUSION"
    echo ""
}

check_github_pages() {
    log "${BLUE}Checking GitHub Pages...${NC}"
    
    PAGES_JSON=$(curl -s "$GITHUB_API/pages")
    PAGE_URL=$(echo "$PAGES_JSON" | grep -o '"html_url":"[^"]*"' | head -1 | cut -d'"' -f4)
    PAGE_STATUS=$(echo "$PAGES_JSON" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    LAST_COMMIT=$(echo "$PAGES_JSON" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    log "  Pages URL: $PAGE_URL"
    log "  Status: $PAGE_STATUS"
    log "  Last Commit SHA: $LAST_COMMIT"
    echo ""
}

check_messaging_api() {
    log "${BLUE}Checking messaging API endpoints...${NC}"
    
    # Test basic connectivity
    API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$VERITON_URL/api/health" 2>/dev/null || echo "000")
    
    if [ "$API_RESPONSE" != "000" ]; then
        log "  API Health Check: HTTP $API_RESPONSE"
    else
        log "  API Health Check: No specific health endpoint found"
    fi
    
    # Check for Supabase connection
    SUPABASE_CHECK=$(curl -s "$VERITON_URL" | grep -o "supabase" | head -1)
    if [ ! -z "$SUPABASE_CHECK" ]; then
        log "  Supabase Integration: Detected"
    else
        log "  Supabase Integration: Not immediately visible in HTML"
    fi
    echo ""
}

test_websocket_connectivity() {
    log "${BLUE}WebSocket Connection Test${NC}"
    
    # This would require a more complex WebSocket testing script
    log "  WebSocket: Manual browser testing required"
    log "  Expected: Real-time messaging interface"
    log "  Test: Open veriton.io in browser and verify chat functionality"
    echo ""
}

generate_report() {
    log "${YELLOW}Generating Deployment Report...${NC}"
    
    REPORT_FILE="/tmp/deployment_report_$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
DEPLOYMENT MONITORING REPORT
============================
Generated: $(date)
Target: veriton.io
System: Employee Messaging System

VERITON.IO STATUS
-----------------
EOF
    
    curl -sI "$VERITON_URL" >> "$REPORT_FILE"
    
    cat >> "$REPORT_FILE" << EOF

GITHUB ACTIONS STATUS
---------------------
EOF
    
    curl -s "$GITHUB_API/actions/runs?per_page=1" | head -50 >> "$REPORT_FILE"
    
    log "${GREEN}Report saved to: $REPORT_FILE${NC}"
    echo ""
}

# Main monitoring loop
monitor_deployment() {
    log "${GREEN}Starting deployment monitoring...${NC}"
    log "Log file: $TIMESTAMP_FILE"
    echo ""
    
    # Initial baseline check
    log "${YELLOW}Baseline Check (Before Push)${NC}"
    check_veriton_headers
    check_github_actions
    check_github_pages
    
    # Continuous monitoring
    for i in {1..30}; do
        log "${YELLOW}Monitoring Cycle $i/30${NC}"
        check_veriton_headers
        check_messaging_api
        
        # Every 5th cycle, check GitHub Actions
        if [ $((i % 5)) -eq 0 ]; then
            check_github_actions
        fi
        
        # Every 10th cycle, check GitHub Pages
        if [ $((i % 10)) -eq 0 ]; then
            check_github_pages
        fi
        
        sleep 10
    done
    
    generate_report
    
    log "${GREEN}Monitoring complete!${NC}"
}

# Quick verification mode
quick_check() {
    log "${GREEN}Quick Verification Mode${NC}"
    echo ""
    
    check_veriton_headers
    check_github_actions
    check_messaging_api
    
    log "${YELLOW}To run full monitoring, execute: ./monitor_deployment.sh${NC}"
}

# Help message
show_help() {
    echo "Employee Messaging System - Deployment Monitor"
    echo ""
    echo "Usage:"
    echo "  $0 [option]"
    echo ""
    echo "Options:"
    echo "  monitor    Run continuous monitoring (30 cycles, 10s interval)"
    echo "  quick      Quick verification check"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 monitor   # Full monitoring session"
    echo "  $0 quick     # Quick status check"
    echo ""
}

# Execute based on command line argument
case "${1:-monitor}" in
    monitor)
        monitor_deployment
        ;;
    quick)
        quick_check
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
