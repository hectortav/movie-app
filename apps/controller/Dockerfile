FROM node AS builder
RUN apt-get update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=controller --docker



FROM node AS installer
RUN apt-get update
WORKDIR /app
COPY .gitignore .gitignore

COPY .env .env
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN cd /app/apps/model && npx prisma generate

RUN yarn turbo run build --filter=controller...




FROM node AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

RUN yarn global add ts-node
RUN yarn global add pm2

EXPOSE 8080
RUN ls -l apps/controller
RUN ls -l apps/controller
RUN ls -l apps/controller
RUN ls -l apps/controller
RUN ls -l apps/controller
RUN ls -l apps/controller
RUN ls -l apps/controller
RUN ls -l apps/controller
RUN ls -l apps/controller/dist
RUN ls -l apps/controller/dist
RUN ls -l apps/controller/dist
RUN ls -l apps/controller/dist
RUN ls -l apps/controller/dist
RUN ls -l apps/controller/dist
RUN ls -l apps/controller/dist

CMD [ "sh", "-c", "node_modules/.bin/prisma migrate deploy --schema apps/model/prisma/schema.prisma && /home/expressjs/.yarn/bin/pm2-runtime /home/expressjs/.yarn/bin/ts-node-esm apps/controller/dist/index.js"]

