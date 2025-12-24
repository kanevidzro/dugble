# --------------------------
# Base image
# --------------------------
FROM oven/bun:1.1 AS base
WORKDIR /app

# --------------------------
# Prepare minimal context using turbo prune
# --------------------------
FROM base AS prepare

COPY package.json bun.lock turbo.json ./
COPY apps/docs ./apps/docs
COPY packages ./packages

# Install dev dependencies for prune
RUN bun install

# Prune for docs app only
RUN bun turbo prune docs --docker

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

# Build only the docs app
RUN bun turbo run build --filter=docs...

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.1-slim AS runner
WORKDIR /app

# Copy production node_modules and built docs app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/docs/.next ./apps/docs/.next
COPY --from=builder /app/package.json ./package.json

# Expose port used by docs
ENV PORT=3002
EXPOSE 3002

# Start the Next.js docs app
CMD ["bun", "apps/docs/node_modules/.bin/next", "start", "-p", "3002"]
