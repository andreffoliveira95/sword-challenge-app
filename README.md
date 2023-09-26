# Sword API Challenge

Repository for source code related to the task requested by Sword.

## Features

In addition to the main required features, I took the initiative to add some extra features.

#### CircleCI

First time I implemented a project in CircleCI. The pipe install dependencies, runs all the tests. After that, it builds a docker image for the production version of the app and then pushes it to a private repository in DockerHub.

#### JWT Authentication

Added JWT for user authentication.

#### NGINX

Added Nginx so that the user doesn't directly communicate with the API acting as a "reverse-proxy" and a security point. Since I mainly run the app locally, I didn't utilize its Load Balancing features.

Because of Nginx, app is acessible on http://localhost:80

#### RabbitMQ

Despite that I never had contact with any message broker before, I managed to create a notification system using RabbitMQ.

#### Kubernetes

Created multiple deployments, services, configmaps and secrets files to be deployed in a cluster setup.

#### Swagger

Added swagger documentation to generate an interactive API documentation following OpenAPI specifications while giving good a developing experience.

To make use of it, simply access http://localhost/documentation or go to home page http://localhost/ and click on link saying 'Documentation' after the environment is up and running

## Running Local Developer Environment

You have two options. Both of them require you to have docker installed.

### Using Docker Compose

```bash
docker compose up
```

### Using Custom Bash Shell Script File

```bash
sh ./start-dev-env.sh
```

## Improvements To Be Considered

#### Reddis

Reddis would be a great feature to add as a cache in order to reduce DB queries. Despite the fact that I did not have much contact with Reddis before, I wanted to implement some cache features but my time was limited. :(

#### Integration Tests

Integration tests is an essential part of any app development. Due to time limitations, I could not make integration tests. However, the app is fully unit tested wherever was possible.
