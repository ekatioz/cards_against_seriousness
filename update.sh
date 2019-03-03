#!/bin/bash

echo "Pull current state from GitHub"
git pull
echo "Updating dependencies"
npm i
echo "Building App"
npm run build
echo "Restart Service"
sudo systemctl restart cardsagainst