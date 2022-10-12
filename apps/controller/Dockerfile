# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM node AS builder
RUN apt-get update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=controller --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node AS installer
RUN apt-get update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore

COPY .env .env
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN cd /app/apps/model && npx prisma generate

RUN yarn turbo run build --filter=controller...

FROM node AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

RUN yarn global add ts-node

EXPOSE 8080

CMD node_modules/.bin/prisma migrate deploy --schema apps/model/prisma/schema.prisma && node_modules/.bin/ts-node-esm apps/controller/dist/index.js
