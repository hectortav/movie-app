FROM node AS builder
RUN apt-get update
WORKDIR /app

RUN yarn global add turbo

COPY . .
RUN turbo prune --scope=view --docker

FROM node AS installer
RUN apt-get update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ENV NEXT_PUBLIC_API /api

RUN yarn turbo run build --filter=ui
RUN yarn turbo run build --filter=view

FROM node AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/view/next.config.js .
COPY --from=installer /app/apps/view/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/view/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/view/.next/static ./apps/view/.next/static

RUN yarn global add pm2
EXPOSE 3000

CMD [ "/home/nextjs/.yarn/bin/pm2-runtime", "apps/view/server.js" ]

