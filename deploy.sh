#!/bin/bash

# PRODUCTION
git reset --hard
git checkout master
git pull origin master

docker compose down
docker compose up -d

# DEVELOPMENT
# git reset --hard
# git checkout develop
# git pull origin develop

# npm i
# pm2 start "npm run start:dev" --name=AsianFoods