# --------------------------
# Base image
# --------------------------
FROM oven/bun:1.1 AS base
WORKDIR /app

# --------------------------
# Prepare minimal context using turbo prune
# --------------------------
FROM base AS prepare

COPY package.json bun.lockb turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages

# Install dev dependencies for prune
RUN bun install

# Prune for web app only
RUN bun turbo prune web --docker

# --------------------------
# Builder
# --------------------------
FROM base AS builder
WORKDIR /app

COPY --from=prepare /app/out/json/ ./

# Install production dependencies only
RUN bun install --production

# Copy pruned full source
COPY --from=prepare /app/out/full/ ./

# Build only the web app
RUN bun turbo run build --filter=web...

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.1-slim AS runner
WORKDIR /app

# Copy production node_modules and built web app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/package.json ./package.json

# Expose port used by web
EXPOSE 3000

# Start the Next.js web app
CMD ["bun", "apps/web/node_modules/.bin/next", "start", "-p", "3000"]
