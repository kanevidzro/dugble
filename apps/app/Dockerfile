FROM oven/bun:1.3 AS base
WORKDIR /app

FROM base AS prepare
COPY package.json bun.lock turbo.json ./
COPY apps/app ./apps/app
COPY packages ./packages

RUN bun install
RUN bun install turbo --global

RUN bun turbo prune app --docker

FROM base AS builder
WORKDIR /app
COPY --from=prepare /app/out/json/ ./
RUN bun install --production
COPY --from=prepare /app/out/full/ ./
RUN bun install turbo --global
RUN bun turbo run build --filter=app...

FROM oven/bun:1.3-slim AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/app/.next ./apps/app/.next
COPY --from=builder /app/package.json ./package.json

ENV PORT=3001
EXPOSE 3001
CMD ["bun", "apps/app/node_modules/.bin/next", "start", "-p", "3001"]
