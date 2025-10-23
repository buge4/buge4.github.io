#!/bin/bash

# Firebase Hosting Deployment Script
# This script authenticates using a service account and deploys to Firebase Hosting

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Firebase Hosting Deployment Script ===${NC}"
echo ""

# Check if service account file exists
if [ ! -f "firebase-service-account.json" ]; then
    echo -e "${RED}Error: firebase-service-account.json not found!${NC}"
    echo "Please ensure the service account JSON file is in the project root."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
fi

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    echo -e "${YELLOW}Warning: firebase.json not found. Creating default configuration...${NC}"
    cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOF
    echo -e "${GREEN}Created firebase.json with default configuration.${NC}"
fi

echo -e "${GREEN}Step 1: Authenticating with Firebase...${NC}"
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/firebase-service-account.json"

# Authenticate using service account
firebase login:ci --no-localhost || {
    echo -e "${YELLOW}Using service account authentication...${NC}"
}

echo ""
echo -e "${GREEN}Step 2: Installing dependencies...${NC}"
pnpm install --prefer-offline

echo ""
echo -e "${GREEN}Step 3: Building the project...${NC}"
pnpm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed! dist directory not found.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 4: Deploying to Firebase Hosting...${NC}"

# Deploy using service account
firebase deploy --only hosting --token "$(cat firebase-service-account.json | jq -r '.private_key')" --project "$(cat firebase-service-account.json | jq -r '.project_id')" 2>&1 | tee deploy.log || {
    # If token-based auth fails, try using GOOGLE_APPLICATION_CREDENTIALS
    echo -e "${YELLOW}Token authentication failed, trying service account...${NC}"
    firebase deploy --only hosting --project "$(cat firebase-service-account.json | jq -r '.project_id')" 2>&1 | tee deploy.log
}

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=== Deployment Successful! ===${NC}"
    
    # Extract and display the deployment URL
    PROJECT_ID=$(cat firebase-service-account.json | jq -r '.project_id')
    HOSTING_URL="https://${PROJECT_ID}.web.app"
    
    echo -e "${GREEN}Deployment URL: ${HOSTING_URL}${NC}"
    echo -e "${GREEN}Alternative URL: https://${PROJECT_ID}.firebaseapp.com${NC}"
    echo ""
    echo "Deployment completed at: $(date)"
else
    echo -e "${RED}Deployment failed! Check deploy.log for details.${NC}"
    exit 1
fi
