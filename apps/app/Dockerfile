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
COPY apps/app ./apps/app
COPY packages ./packages

# Install dev dependencies for prune
RUN bun install

# Prune for app app only
RUN bun turbo prune app --docker

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

# Build only the app app
RUN bun turbo run build

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

# Copy production node_modules and built app app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/app/.next ./apps/app/.next
COPY --from=builder /app/package.json ./package.json

# Expose port used by app
EXPOSE 3001

# Start the Next.js app
CMD ["bun", "apps/app/node_modules/.bin/next", "start", "-p", "3001"]
