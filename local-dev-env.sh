#!/bin/bash -xe

createNetwork() {
    docker network create challenge-network
}

launchMySQL() {
    docker run \
    -d \
    --net challenge-network \
    -v mysql_data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=password \
    -e MYSQL_DATABASE=sword_challenge_db \
    --name mysql_db mysql:8.1
}

buildApp() {
    docker build -t challenge-app-image --build-arg NODE_ENV=development .
}

launchApp() {
    docker run \
    --rm \
    --net challenge-network \
    -p 3000:3000 \
    -v $(pwd):/app:ro \
    -v /app/node_modules \
    --env-file .env \
    --name challenge-app challenge-app-image
}

createNetwork
launchMySQL
buildApp
launchApp