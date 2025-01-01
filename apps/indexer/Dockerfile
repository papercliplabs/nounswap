# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /app

# Install Python and other build tools required by node-gyp
RUN apt-get update && apt-get install -y python3 python3-distutils build-essential && \
    ln -sf /usr/bin/python3 /usr/bin/python

COPY package.json bun.lockb ./

# Copy all packages package.json for dependency resolution
COPY apps/indexer/package.json ./apps/indexer/package.json
COPY apps/web/package.json ./apps/web/package.json

FROM base AS dev-deps
RUN bun install --frozen-lockfile

FROM base AS prod-deps
RUN bun install --frozen-lockfile --production

FROM dev-deps AS dev
COPY . . 
EXPOSE 42069
CMD ["bun", "dev:indexer"]

FROM prod-deps AS prod
COPY apps/indexer . 
EXPOSE 42069
CMD ["bun", "start:indexer"]
