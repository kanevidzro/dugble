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

# Install dev dependencies for prune
RUN bun install

# Create minimal context for API only
RUN bun turbo prune api --docker

# --------------------------
# Builder
# --------------------------
FROM base AS builder
WORKDIR /app

# Copy pruned files
COPY --from=prepare /app/out/json/ ./

# Install production dependencies only
RUN bun install --production

# Copy the pruned full source
COPY --from=prepare /app/out/full/ ./

# Build only the API
RUN bun turbo run build

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

# Copy production node_modules and built API
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/package.json ./package.json

# Expose the port used by the container
EXPOSE 8080

# Run the compiled API
CMD ["bun", "apps/api/dist/server.js"]
