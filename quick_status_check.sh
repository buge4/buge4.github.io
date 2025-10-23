#!/bin/bash

# Quick GitHub Actions Status Check
# Date: 2025-10-24 04:10:19

echo "=========================================="
echo "GitHub Actions Status Check"
echo "=========================================="
echo ""

# Check latest runs
echo "Latest GitHub Actions Runs:"
curl -s "https://api.github.com/repos/buge4/buge4.github.io/actions/runs?per_page=3" | \
  jq -r '.workflow_runs[] | "ID: \(.id) | \(.status) | \(.conclusion) | \(.created_at) | \(.head_sha[0:8])"' 2>/dev/null || \
  echo "Unable to fetch GitHub Actions data"

echo ""
echo "----------------------------------------"

# Check site status
echo ""
echo "Site Status:"
echo "veriton.io:"
curl -sI https://veriton.io | head -1

echo "buge4.github.io:"
curl -sI https://buge4.github.io | head -1

echo ""
echo "----------------------------------------"

# Check if files are in dist
echo ""
echo "Repository dist directory check:"
curl -s "https://api.github.com/repos/buge4/buge4.github.io/contents/dist" | \
  jq -r '.[] | "  \(.type): \(.name) - \(.size // "N/A") bytes"' 2>/dev/null || \
  echo "Unable to fetch dist directory contents"

echo ""
echo "=========================================="
