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
COPY apps/docs ./apps/docs
COPY packages ./packages

# Use bun x to run turbo without needing a global install
RUN bun x turbo prune docs --docker

# --------------------------
# Builder
# --------------------------
FROM base AS builder
WORKDIR /app

# 1. Copy pruned locks and package.json files
COPY --from=prepare /app/out/json/ ./
# Install ALL dependencies (including devDeps needed for building)
RUN bun install

# 2. Copy the full source code
COPY --from=prepare /app/out/full/ ./

# 3. Build using bun x (Solves the "Script not found" error)
RUN bun x turbo run build --filter=docs...

# --------------------------
# Runner
# --------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only the necessary production artifacts
COPY --from=builder /app/node_modules ./node_modules
# Note: For Next.js, you usually need the .next folder and public files
COPY --from=builder /app/apps/docs/.next ./apps/docs/.next
COPY --from=builder /app/apps/docs/public ./apps/docs/public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3002

# Run the app
CMD ["bun", "run", "start"] 
# Alternatively, if you have a start script: CMD ["bun", "start", "--prefix", "apps/docs"]
