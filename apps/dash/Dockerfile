FROM oven/bun:1.3 AS base
WORKDIR /app

FROM base AS prepare
COPY package.json bun.lock turbo.json ./
COPY apps/dash ./apps/dash
COPY packages ./packages

RUN bun install
RUN bun install turbo --global

RUN bun turbo prune dash --docker

FROM base AS builder
WORKDIR /app
COPY --from=prepare /app/out/json/ ./
RUN bun install --production
COPY --from=prepare /app/out/full/ ./
RUN bun install turbo --global
RUN bun turbo run build --filter=dash...

FROM oven/bun:1.3-slim AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/dash/.next ./apps/dash/.next
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
CMD ["bun", "start"]
