# Sword API Challenge

Repository for source code related to the task requested by Sword.

## Features

In addition to the main required features, I took the initiative to add some extra features.

#### CircleCI

First time I implemented a project in CircleCI. The pipe install dependencies, runs all the tests. After that, it builds a docker image for the production version of the app and then pushes it to a private repository in DockerHub.

#### JWT Authentication

Added JWT for user authentication.

#### NGINX

Added Nginx so that the user doesn't directly communicate with the API neither the RabbitMQ Management Portal, acting as a "reverse-proxy" and a security point. Since I mainly run the app locally, I didn't utilize its Load Balancing features.

App: http://localhost:80

RabbitMQ Management Portal: http://localhost:80/rabbitmq

#### RabbitMQ

Despite that I never had contact with any message broker before, I managed to create a notification system using RabbitMQ.

#### Kubernetes

Created multiple deployments, services, configmaps and secrets files to be deployed in a cluster setup.

#### Swagger

Added swagger documentation to generate an interactive API documentation following OpenAPI specifications while giving good a developing experience.

To make use of it, simply access http://localhost/documentation or go to home page http://localhost/ and click on link saying 'Documentation' after the environment is up and running.

## Running Local Developer Environment

You have two options. Both of them require you to have docker installed.

### Using Docker Compose (Recommended)

```bash
docker compose up
```

### Using Custom Bash Shell Script File

```bash
sh ./start-dev-env.sh
```

## Setting up a Local Single Kubernetes Cluster

For this setup, I'm using minikube as a local k8s cluster and we are going to deploy local docker Nginx and App images.

Make sure you are in the root folder.

```bash
# start local k8s cluster
minikube start

# use the docker daemon inside minikube
eval $(minikube docker-env)

# to use kubectl
alias kubectl="minikube kubectl --"

# builds APP image locally to be used in k8s build. Name should match deployment image name.
docker build -t node-app --build-arg NODE_ENV=production .

# deploy k8s objects
kubectl apply -f ./k8s/configmaps/
kubectl apply -f ./k8s/secrets/
kubectl apply -f ./k8s/pvcs/
kubectl apply -f ./k8s/services/
kubectl apply -f ./k8s/deployments/
```

Note: Due to mysql taking a while to be launched and accepting connections and the app being dependent on it, kubernetes will launch an error. The same happens with nginx which is dependent on app.

## Improvements To Be Considered

#### Reddis

Reddis would be a great feature to add as a cache in order to reduce DB queries. Despite the fact that I did not have much contact with Reddis before, I wanted to implement some cache features but my time was limited. :(

#### Integration Tests

Integration tests is an essential part of any app development. Due to time limitations, I could not make integration tests. However, the app is fully unit tested wherever was possible.
