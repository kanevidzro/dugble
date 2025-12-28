# STAGE 1: Base
FROM oven/bun:1.3-alpine AS base
# Prisma 7+ needs openssl for certain providers; libc6 for general compatibility
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# STAGE 2: Prune
FROM base AS pruner
COPY . .
ARG APP_NAME
RUN npx turbo prune ${APP_NAME} --docker

# STAGE 3: Installer
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
# Install dependencies at the root (where Bun puts them)
RUN bun install --frozen-lockfile

# STAGE 4: Builder
FROM installer AS builder
ARG APP_NAME
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# If using Prisma: Generate client for the internal package
RUN bunx turbo run db:generate --filter=@dugble/prisma

# Build the specific app
RUN bunx turbo build --filter=${APP_NAME}

# STAGE 5: Runner
FROM base AS runner
ARG APP_NAME
WORKDIR /app

# Create a non-root user for security (2025 Best Practice)
RUN addgroup --system --gid 1001 bunjs && adduser --system --uid 1001 bunjs
USER bunjs

# 1. Copy ROOT node_modules (this solves your "not found" error)
COPY --from=builder /app/node_modules ./node_modules

# 2. Copy the built APP package (adjust path for your specific app)
COPY --from=builder /app/apps/${APP_NAME}/dist ./apps/${APP_NAME}/dist
COPY --from=builder /app/apps/${APP_NAME}/package.json ./apps/${APP_NAME}/package.json

# 3. Copy internal workspace packages (like Prisma client)
COPY --from=builder /app/packages ./packages

# Set dynamic start command
ENV APP_DIR=apps/${APP_NAME}
# Use shell form to allow variable expansion
CMD ["sh", "-c", "bun run --cwd ${APP_DIR} start"]
