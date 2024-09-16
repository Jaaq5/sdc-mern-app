#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'   # Success messages in green
RED='\033[0;31m'     # Error messages in red
BLUE='\033[0;34m'    # Informational messages in blue
NC='\033[0m'         # No color (reset)

# Check for .env.development in server
if [ ! -f server/.env.development ]; then
  echo -e "${RED}Error: .env.development file is missing in the server directory.${NC}" >&2
  exit 1
fi

# Check for .env.development in client
if [ ! -f client/.env.development ]; then
  echo -e "${RED}Error: .env.development file is missing in the client directory.${NC}" >&2
  exit 1
fi

# Start development servers
echo -e "${BLUE}Starting development servers...${NC}"

# Run both server and client servers concurrently
if concurrently "cd server && npm run start-dev" "cd client && npm start"; then
  echo -e "${GREEN}Development servers started successfully.${NC}"
else
  echo -e "${RED}Failed to start development servers.${NC}" >&2
  exit 1
fi
