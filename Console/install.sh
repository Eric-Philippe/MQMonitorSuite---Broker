#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # Pas de couleur

# Aller dans le répertoire frontend, installer les dépendances et construire le projet
echo -e "${BLUE}Navigating to frontend directory...${NC}"
cd frontend || { echo -e "${RED}Failed to navigate to frontend directory!${NC}"; exit 1; }

echo -e "${GREEN}Installing frontend dependencies...${NC}"
npm install || { echo -e "${RED}Failed to install frontend dependencies!${NC}"; exit 1; }

echo -e "${GREEN}Building frontend project...${NC}"
ng build || { echo -e "${RED}Failed to build frontend project!${NC}"; exit 1; }

# Aller dans le répertoire server, installer les dépendances et démarrer le serveur
echo -e "${BLUE}Navigating to server directory...${NC}"
cd ../server || { echo -e "${RED}Failed to navigate to server directory!${NC}"; exit 1; }

echo -e "${GREEN}Installing server dependencies...${NC}"
npm install || { echo -e "${RED}Failed to install server dependencies!${NC}"; exit 1; }

echo -e "${GREEN}Starting server...${NC}"
npm run build || { echo -e "${RED}Failed to buil server!${NC}"; exit 1; }

echo -e "${GREEN}All tasks completed successfully!${NC}"
echo -e "${GREEN}You can now start the server by running 'npm start' in the server directory.${NC}"