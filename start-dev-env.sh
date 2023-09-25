#!/bin/bash -xe

createNetwork() {
    docker network create challenge-network
}

launchMySQL() {
    docker run \
    -d \
    --net challenge-network \
    -p 3306:3306 \
    -v mysql_data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=password \
    -e MYSQL_DATABASE=sword_challenge_db \
    --name mysql_db mysql:8.1
}

launchRabbitMQ() {
    docker run \
    -d \
    --net challenge-network \
    -p 5672:5672 \
    -p 15672:15672 \
    -e RABBITMQ_DEFAULT_USER=root \
    -e RABBITMQ_DEFAULT_PASS=password \
    --name rabbitmq rabbitmq:3.8-management
}

buildApp() {
    docker build -t node-app-image --build-arg NODE_ENV=development .
}

launchApp() {
    docker run \
    -d \
    --rm \
    --net challenge-network \
    -p 3000 \
    -v $(pwd):/app:ro \
    -v /app/node_modules \
    --env-file .env \
    --name node-app node-app-image \
     sh -c "sleep 45 && npm run development"
}

buildNginx() {
    docker build -t nginx-image ./nginx
}

launchNginx() {
    docker run \
    --restart=always \
    --net challenge-network \
    -p 80:80 \
    --name nginx nginx-image
}

start() {
    createNetwork
    launchMySQL
    launchRabbitMQ
    buildApp
    launchApp
    buildNginx
    launchNginx
}

start