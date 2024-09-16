#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'   # Success messages in green
RED='\033[0;31m'     # Error messages in red
BLUE='\033[0;34m'    # Informational messages in blue
NC='\033[0m'         # No color (reset)

# Function to validate PORT input
validate_port() {
  local port
  while true; do
    read -p "Please enter a PORT for server .env (3000-65535): " port
    if [[ "$port" =~ ^[0-9]+$ ]] && [ "$port" -ge 3000 ] && [ "$port" -le 65535 ]; then
      echo "$port"
      return 0
    else
      echo -e "${RED}Invalid PORT. Please enter a number between 3000 and 65535.${NC}"
    fi
  done
}

# Function to validate MONGO_URI input
validate_mongo_uri() {
  local uri
  while true; do
    read -p "Please enter a database name (max 50 characters): " uri
    if [[ ${#uri} -le 50 ]]; then
      echo "$uri"
      return 0
    else
      echo -e "${RED}Database name is too long. Please enter a name up to 50 characters.${NC}"
    fi
  done
}

# Function to validate public IP input
validate_ip() {
  local ip
  while true; do
    read -p "Please enter the public IP address for client: " ip
    if [[ "$ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
      echo "$ip"
      return 0
    else
      echo -e "${RED}Invalid IP address. Please enter a valid public IP address.${NC}"
    fi
  done
}

# Install production dependencies
echo -e "${BLUE}Installing production dependencies...${NC}"
if npm install --omit=dev > /dev/null 2>&1; then
  echo -e "${GREEN}Production dependencies installed successfully.${NC}"
else
  echo -e "${RED}Failed to install production dependencies.${NC}" >&2
  exit 1
fi

# Check if server .env.production already exists
cd server
if [ ! -f .env.production ]; then
  echo -e "${BLUE}Setting up .env.production file for server...${NC}"

  if cp .env.example .env.production; then
    # Update NODE_ENV in .env.production
    sed -i 's|NODE_ENV=CHANGEMYNAME|NODE_ENV=production|' .env.production

    # Prompt user for PORT
    echo "Example: 4000"
    PORT=$(validate_port)
    # Set PORT in .env.production
    sed -i "s|PORT=CHANGEMYNAME|PORT=$PORT|" .env.production

    # Prompt user for MONGO_URI
    echo "Example: sdc_db"
    MONGO_URI=$(validate_mongo_uri)
    # Set MONGO_URI in .env.production
    sed -i "s|MONGO_URI=CHANGEMYNAME|MONGO_URI=mongodb://localhost:27017/$MONGO_URI|" .env.production

    echo -e "${GREEN}.env.production setup successfully for server.${NC}"
  else
    echo -e "${RED}Failed to copy .env.example to .env.production.${NC}" >&2
    exit 1
  fi
else
  echo -e "${BLUE}.env.production already exists in server. Skipping creation.${NC}"
fi
cd ..

# Check if client .env.production already exists
cd client
if [ ! -f .env.production ]; then
  echo -e "${BLUE}Setting up .env.production file for client...${NC}"

  if cp .env.example .env.production; then
    # Set NODE_ENV in .env.production
    sed -i 's/NODE_ENV=CHANGEMYNAME/NODE_ENV=production/' .env.production

    # Prompt user for public IP
    echo "Example: 129.80.112.63"
    PUBLIC_IP=$(validate_ip)
    
    # Set REACT_APP_API_URL with server PORT in .env.production
    sed -i "s|REACT_APP_API_URL=CHANGEMYNAME|REACT_APP_API_URL=http://$PUBLIC_IP:$PORT|" .env.production

    echo -e "${GREEN}.env.production setup successfully for client.${NC}"
  else
    echo -e "${RED}Failed to copy .env.example to .env.production.${NC}" >&2
    exit 1
  fi
else
  echo -e "${BLUE}.env.production already exists in client. Skipping creation.${NC}"
fi
cd ..

# Install server dependencies
echo -e "${BLUE}Installing server dependencies...${NC}"
cd server
if npm run install-pro > /dev/null 2>&1; then
  echo -e "${GREEN}Server dependencies installed successfully.${NC}"
else
  echo -e "${RED}Failed to install server dependencies.${NC}" >&2
  exit 1
fi

# Final success message
echo ""
echo -e "${GREEN}All production dependencies installed successfully.${NC}"
