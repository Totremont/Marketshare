# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
#ENV NODE_ENV production

WORKDIR /usr/src/app

#Copy configuration file
COPY package.json .
COPY package-lock.json .

RUN npm ci

USER node

# Copy the rest of the source files into the image.
COPY . .

EXPOSE 8030

# Run the application.
CMD npx tsx index.ts
