#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'   # Success messages in green
RED='\033[0;31m'     # Error messages in red
BLUE='\033[0;34m'    # Informational messages in blue
NC='\033[0m'         # No color (reset)

# Check for .env.production in server
if [ ! -f server/.env.production ]; then
  echo -e "${RED}Error: .env.production file is missing in the server directory.${NC}" >&2
  exit 1
fi

# Check for .env.production in client
if [ ! -f client/.env.production ]; then
  echo -e "${RED}Error: .env.production file is missing in the client directory.${NC}" >&2
  exit 1
fi

# Check for build directory in client
if [ ! -d client/build ]; then
  echo -e "${RED}Error: build directory is missing in the client directory.${NC}" >&2
  exit 1
fi

# Start production server
echo -e "${BLUE}Starting production server...${NC}"

# Run the server production command
if cd server && npm run start-pro; then
  echo -e "${GREEN}Production server started successfully.${NC}"
else
  echo -e "${RED}Failed to start production server.${NC}" >&2
  exit 1
fi
