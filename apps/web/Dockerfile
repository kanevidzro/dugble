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
COPY apps/web ./apps/web
COPY packages ./packages

# Use bun x to prune without needing a global install
RUN bun x turbo prune web --docker

# --------------------------
# Builder
# --------------------------
FROM base AS builder
WORKDIR /app

# 1. Copy pruned package files
COPY --from=prepare /app/out/json/ ./
# Install ALL dependencies (build needs devDependencies like turbo/compilers)
RUN bun install

# 2. Copy the full source
COPY --from=prepare /app/out/full/ ./

# 3. Build using bun x (Solves the "Script not found" error)
RUN bun x turbo run build --filter=web...

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules and built assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
