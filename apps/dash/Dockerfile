# Stage 1: Base image
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Stage 2: Prune the monorepo
FROM base AS pruner
# Installing turbo globally is no longer strictly required if using bunx
COPY . .
RUN bunx turbo prune dash --docker

# Stage 3: Installer - Install only necessary dependencies
FROM base AS installer
# Copy pruned package files and lockfile (ensures cache-hit on subsequent builds)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

# Stage 4: Builder - Build the application
# Start from installer to keep node_modules
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
# Build using the filter to only process the specific app
RUN bunx turbo build --filter=dash

# Stage 5: Runner - Production image
FROM base AS runner
# Copy built app and dependencies from builder stage
COPY --from=builder /app/apps/dash/node_modules ./node_modules
COPY --from=builder /app/apps/dash/package.json ./package.json

# Adjust this path based on your framework (e.g., .next for Next.js, dist for Vite/Nest)
COPY --from=builder /app/apps/dash/.next ./.next

EXPOSE 3001
CMD ["bun", "run", "start"]
