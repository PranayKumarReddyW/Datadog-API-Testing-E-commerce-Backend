#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Datadog E-commerce API Backend - Installation Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}[1/5] Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v16 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"
echo ""

# Check if MongoDB is installed
echo -e "${YELLOW}[2/5] Checking MongoDB installation...${NC}"
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found in PATH${NC}"
    echo -e "${BLUE}   You can start MongoDB with Docker:${NC}"
    echo -e "${BLUE}   docker run -d -p 27017:27017 --name mongodb mongo:latest${NC}"
else
    echo -e "${GREEN}✅ MongoDB detected${NC}"
fi
echo ""

# Install dependencies
echo -e "${YELLOW}[3/5] Installing npm dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Check if .env exists
echo -e "${YELLOW}[4/5] Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${BLUE}   Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Display next steps
echo -e "${YELLOW}[5/5] Setup complete!${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      Next Steps                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}1. Start MongoDB:${NC}"
echo -e "   ${BLUE}brew services start mongodb-community${NC}"
echo -e "   ${BLUE}# OR${NC}"
echo -e "   ${BLUE}docker run -d -p 27017:27017 --name mongodb mongo:latest${NC}"
echo ""
echo -e "${GREEN}2. Seed the database (creates 10 users + 50 products):${NC}"
echo -e "   ${BLUE}npm run seed${NC}"
echo ""
echo -e "${GREEN}3. Start the development server:${NC}"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo -e "${GREEN}4. Server will be available at:${NC}"
echo -e "   ${BLUE}http://localhost:5000${NC}"
echo ""
echo -e "${GREEN}5. Import Postman collection:${NC}"
echo -e "   ${BLUE}postman/Datadog-API-Collection.json${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Test Credentials                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Admin:${NC}"
echo -e "   Email: ${BLUE}admin@test.com${NC}"
echo -e "   Password: ${BLUE}Admin@123${NC}"
echo ""
echo -e "${GREEN}User:${NC}"
echo -e "   Email: ${BLUE}john@test.com${NC}"
echo -e "   Password: ${BLUE}Test@123${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                     Documentation                          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "   📖 ${BLUE}README.md${NC} - Complete documentation"
echo -e "   🚀 ${BLUE}QUICKSTART.md${NC} - Quick start guide"
echo -e "   📊 ${BLUE}PROJECT_SUMMARY.md${NC} - Project overview"
echo -e "   🗺️  ${BLUE}API_REFERENCE.md${NC} - API endpoints reference"
echo ""
echo -e "${GREEN}✨ Installation complete! Happy testing! 🚀${NC}"
echo ""
