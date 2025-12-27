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

# Use bun x to avoid needing a global install in this stage
RUN bun x turbo prune api --docker

# --------------------------
# Builder
# --------------------------
FROM base AS builder
WORKDIR /app

# 1. Copy pruned locks and package.json files
COPY --from=prepare /app/out/json/ ./
RUN bun install

# 2. Copy the full source (only for the necessary workspaces)
COPY --from=prepare /app/out/full/ ./

# 3. Build using bun x to ensure turbo is found regardless of PATH
RUN bun x turbo run build --filter=api...

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only what's needed to run the app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

# Ensure the port matches your API configuration
EXPOSE 8080

# Run the compiled code directly with Bun
CMD ["bun", "run", "dist/server.js"]
