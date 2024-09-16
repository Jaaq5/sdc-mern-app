#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'   # Success messages in green
RED='\033[0;31m'     # Error messages in red
BLUE='\033[0;34m'    # Informational messages in blue
NC='\033[0m'         # No color (reset)

# Function to validate IP input
validate_ip() {
  local ip
  while true; do
    read -p "Please enter the public IP address for the client .env: " ip
    if [[ "$ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "$ip"
      return 0
    else
      echo -e "${RED}Invalid IP address. Please enter a valid IP address.${NC}"
    fi
  done
}

# Function to validate PORT input
validate_port() {
  local port
  while true; do
    read -p "Please enter the PORT for the client .env (3000-65535): " port
    if [[ "$port" =~ ^[0-9]+$ ]] && [ "$port" -ge 3000 ] && [ "$port" -le 65535 ]; then
      echo "$port"
      return 0
    else
      echo -e "${RED}Invalid PORT. Please enter a number between 3000 and 65535.${NC}"
    fi
  done
}

# Check for .env.production in client
cd client
if [ ! -f .env.production ]; then
  echo -e "${BLUE}Creating .env.production file for client...${NC}"

  if cp .env.example .env.production; then

    # Set NODE_ENV in .env.production
    sed -i 's/NODE_ENV=CHANGEMYNAME/NODE_ENV=production/' .env.production
    
    # Prompt user for public IP
    echo "Example: 158.101.117.38"
    PUBLIC_IP=$(validate_ip)
    
    # Prompt user for PORT
    echo "Example: 4000"
    PORT=$(validate_port)

    # Set REACT_APP_API_URL in .env.production
    sed -i "s|REACT_APP_API_URL=CHANGEMYNAME|REACT_APP_API_URL=http://$PUBLIC_IP:$PORT|" .env.production

    echo -e "${GREEN}.env.production setup successfully for client.${NC}"
  else
    echo -e "${RED}Failed to copy .env.example to .env.production.${NC}" >&2
    exit 1
  fi
else
  echo -e "${BLUE}.env.production already exists in client. Skipping creation.${NC}"
fi

# Build client
echo -e "${BLUE}Building client for production...${NC}"
if npm run build; then
  echo -e "${GREEN}Client built successfully.${NC}"
else
  echo -e "${RED}Failed to build client.${NC}" >&2
  exit 1
fi

# Final success message
echo ""
echo -e "${GREEN}Client production build completed successfully.${NC}"
