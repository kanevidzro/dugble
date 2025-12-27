# --------------------------
# Base image
# --------------------------
FROM oven/bun:1.3 AS base
WORKDIR /app

# --------------------------
# Prepare minimal context
# --------------------------
FROM base AS prepare
COPY package.json bun.lock turbo.json ./
COPY apps/dash ./apps/dash
COPY packages ./packages

# Use bun x to avoid path issues during pruning
RUN bun x turbo prune dash --docker

# --------------------------
# Builder
# --------------------------
FROM base AS builder
WORKDIR /app

# 1. Copy pruned package files
COPY --from=prepare /app/out/json/ ./
# IMPORTANT: Remove --production here because build tools (turbo) are devDependencies
RUN bun install

# 2. Copy the full source
COPY --from=prepare /app/out/full/ ./

# 3. Build using bun x (Fixes the "Script not found" error)
RUN bun x turbo run build --filter=dash...

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules and built assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/dash/.next ./apps/dash/.next
COPY --from=builder /app/apps/dash/public ./apps/dash/public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001

# Start the application using the local workspace script
CMD ["bun", "run", "start"]
