# --------------------------
# Base image
# --------------------------
FROM oven/bun:1.3 AS base
WORKDIR /app

# --------------------------
# Prepare minimal context using turbo prune
# --------------------------
FROM base AS prepare
COPY package.json bun.lock turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages

# Install dev dependencies for pruning
RUN bun install
RUN bun install turbo --global

# Prune API only
RUN bun turbo prune api --docker

# --------------------------
# Builder
# --------------------------
FROM base AS builder
WORKDIR /app

COPY --from=prepare /app/out/json/ ./
RUN bun install --production

COPY --from=prepare /app/out/full/ ./

# Install turbo globally in builder stage
RUN bun install turbo --global

# Build API
RUN bun turbo run build --filter=api...

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080
CMD ["bun", "apps/api/dist/server.js"]
