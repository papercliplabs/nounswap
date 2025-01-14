# syntax=docker/dockerfile:1

# FROM oven/bun:1 AS base
FROM node:18 AS base

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

COPY package.json bun.lockb ./

FROM base AS dev-deps
RUN bun install --frozen-lockfile

FROM dev-deps AS dev
COPY . . 
EXPOSE 42069
CMD ["bun", "dev"]

FROM base AS prod-deps
RUN bun install --frozen-lockfile --production

FROM prod-deps AS prod
COPY . .
EXPOSE 42069
CMD ["bun", "start"]
