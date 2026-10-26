FROM node:24.22.1-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg62-turbo-dev \
    libgif-dev \
    librsvg2-dev \
    fontconfig \
    fonts-dejavu-core \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /project

RUN mkdir -p /project/node_modules \
  && chown -R node:node /project

USER node
ENV HOME=/home/node
