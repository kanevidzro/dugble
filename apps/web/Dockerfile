# Stage 1: Base image
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Stage 2: Prune (if not done outside Docker)
FROM base AS pruner
RUN bun add -g turbo
COPY . .
RUN turbo prune web --docker

# Stage 3: Installer
FROM base AS installer
COPY --from=pruner /app/out/json/ .
# Install dependencies using the pruned lockfile
RUN bun install --frozen-lockfile

# Stage 4: Builder
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN bun x turbo build --filter=web

# Stage 5: Runner
FROM base AS runner
COPY --from=installer /app/apps/web/node_modules ./node_modules
COPY --from=installer /app/apps/web/package.json ./package.json
# Copy build output (adjust path based on your framework, e.g., .next or dist)
COPY --from=builder /app/apps/web/.next ./.next 

EXPOSE 3000
CMD ["bun", "run", "start"]
