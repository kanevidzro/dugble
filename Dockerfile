FROM oven/bun:1.3-alpine AS base
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

FROM base AS pruner
ARG APP_NAME
COPY . .
RUN bunx turbo prune ${APP_NAME} --docker

FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

FROM installer AS builder
ARG APP_NAME
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN if [ -d "packages/prisma" ]; then bunx turbo run db:generate --filter=@dugble/prisma; fi
RUN bunx turbo build --filter=${APP_NAME}

FROM base AS runner
ARG APP_NAME
ARG APP_PORT
# Re-declaring for the runner stage
ENV APP_NAME=${APP_NAME}
ENV PORT=${APP_PORT}

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/${APP_NAME} ./apps/${APP_NAME}
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/apps/${APP_NAME}
EXPOSE ${PORT}
CMD ["sh", "-c", "bun run start"]
