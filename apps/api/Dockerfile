# Stage 1: Base
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Stage 2: Prune
FROM base AS pruner
COPY . .
RUN bunx turbo prune api --docker

# Stage 3: Installer
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

# Stage 4: Builder
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Generate the Prisma client using the script in your package.json
# This populates packages/prisma/src/generated
RUN bunx turbo run db:generate --filter=@dugble/prisma

# Build the API (consumes the generated client via @dugble/prisma)
RUN bunx turbo build --filter=api

# Stage 5: Runner (Production Image)
FROM base AS runner
WORKDIR /app

# Copy the built API and its specific dependencies
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/node_modules ./node_modules

# Since the client is now bundled in 'dist' or 'node_modules', 
# no extra engine copying is required for Prisma 7.
EXPOSE 8080

CMD ["bun", "run", "start"]
