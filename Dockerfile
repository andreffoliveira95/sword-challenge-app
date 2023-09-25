FROM node:lts-bullseye-slim

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --omit=dev --ignore-scripts; \
    fi

COPY . ./

ENV NODE_ENV_VALUE=$NODE_ENV

USER node

CMD ["sh", "-c", "npm run $NODE_ENV_VALUE"]