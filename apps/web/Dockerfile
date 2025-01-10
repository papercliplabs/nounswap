FROM node:18 AS base

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

COPY package.json bun.lockb ./

# Copy all packages package.json for dependency resolution
COPY apps/indexer/package.json ./apps/indexer/package.json
COPY apps/web/package.json ./apps/web/package.json

FROM base AS dev-deps
RUN bun install --frozen-lockfile

FROM dev-deps AS dev
COPY . . 
EXPOSE 3000
CMD ["bun", "dev:web"]

## Not deploying the docker image in production
# FROM base AS prod-deps
# RUN bun install --frozen-lockfile --production

# FROM prod-deps AS prod
# EXPOSE 42069
# CMD ["bun", "start:indexer"]
