# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM node AS builder
RUN apt-get update
# Set working directory
WORKDIR /app
RUN yarn global add turbo@1.5.6
COPY . .
RUN turbo prune --scope=view --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node AS installer
RUN apt-get update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=view...

FROM node AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/view/next.config.js .
COPY --from=installer /app/apps/view/package.json .

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer --chown=nextjs:nodejs /app/apps/view/.next/standalone ./
# COPY --from=installer --chown=nextjs:nodejs /app/apps/view/.next/static ./apps/view/.next/static

CMD node apps/view/server.js
