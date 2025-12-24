FROM oven/bun:1.3 AS base
WORKDIR /app

FROM base AS prepare
COPY package.json bun.lock turbo.json ./
COPY apps/docs ./apps/docs
COPY packages ./packages

RUN bun install
RUN bun install turbo --global

RUN bun turbo prune docs --docker

FROM base AS builder
WORKDIR /app
COPY --from=prepare /app/out/json/ ./
RUN bun install --production
COPY --from=prepare /app/out/full/ ./
RUN bun install turbo --global
RUN bun turbo run build --filter=docs...

FROM oven/bun:1.3-slim AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/docs/.next ./apps/docs/.next
COPY --from=builder /app/package.json ./package.json

ENV PORT=3002
EXPOSE 3002
CMD ["bun", "apps/docs/node_modules/.bin/next", "start", "-p", "3002"]
