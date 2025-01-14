FROM node:22 AS base

# Install bun
RUN curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun
ENV PATH="/usr/local/bin:$PATH"

WORKDIR /app

COPY package.json bun.lockb ./

FROM base AS dev-deps
RUN bun install --frozen-lockfile

FROM dev-deps AS dev
COPY . . 
EXPOSE 3001
CMD ["bun", "dev"]

FROM base AS prod-deps
RUN bun install --frozen-lockfile --production

# Rebuild the source code only when needed
FROM dev-deps AS builder
COPY . .
RUN bun run build

FROM base AS prod
ENV NODE_ENV production
COPY --from=prod-deps /app/node_modules ./node_modules

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001
ENV PORT 3001

CMD HOSTNAME="0.0.0.0" node server.js
