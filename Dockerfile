# Stage 1: Base
FROM oven/bun:1.3-alpine AS base
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# Stage 2: Prune
FROM base AS pruner
ARG APP_NAME
COPY . .
RUN bunx turbo prune ${APP_NAME} --docker

# Stage 3: Installer
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

# Stage 4: Builder
FROM installer AS builder
ARG APP_NAME
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
# Generate Prisma if the package exists
RUN if [ -d "packages/prisma" ]; then bunx turbo run db:generate --filter=@dugble/prisma; fi
RUN bunx turbo build --filter=${APP_NAME}

# Stage 5: Runner
FROM base AS runner
# --- CRITICAL: Re-declare ARGs here to make them available in this stage ---
ARG APP_NAME
ARG APP_PORT
# --------------------------------------------------------------------------
WORKDIR /app

# Copy root node_modules and internal packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/${APP_NAME} ./apps/${APP_NAME}

ENV PORT=${APP_PORT}
ENV NODE_ENV=production
EXPOSE ${APP_PORT}

# Run from the app directory
WORKDIR /app/apps/${APP_NAME}

# Use shell form to ensure $PORT is correctly passed to Bun
CMD ["sh", "-c", "bun run start"]
