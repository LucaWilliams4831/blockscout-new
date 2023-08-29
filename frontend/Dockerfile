# *****************************
# *** STAGE 1: Dependencies ***
# *****************************
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

### APP
# Install dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add git
RUN yarn --frozen-lockfile


### FEATURE REPORTER
# Install dependencies
WORKDIR /feature-reporter
COPY ./deploy/tools/feature-reporter/package.json ./deploy/tools/feature-reporter/yarn.lock ./
RUN yarn --frozen-lockfile


### ENV VARIABLES CHECKER
# Install dependencies
WORKDIR /envs-validator
COPY ./deploy/tools/envs-validator/package.json ./deploy/tools/envs-validator/yarn.lock ./
RUN yarn --frozen-lockfile


# *****************************
# ****** STAGE 2: Build *******
# *****************************
FROM node:18-alpine AS builder
RUN apk add --no-cache --upgrade libc6-compat bash

# pass commit sha and git tag to the app image
ARG GIT_COMMIT_SHA
ENV NEXT_PUBLIC_GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ARG GIT_TAG
ENV NEXT_PUBLIC_GIT_TAG=$GIT_TAG

ENV NODE_ENV production

### APP
# Copy dependencies and source code
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate .env.production with ENVs placeholders and save build args into .env file
COPY --chmod=+x ./deploy/scripts/make_envs_template.sh ./
RUN ./make_envs_template.sh ./docs/ENVS.md

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Build app for production
RUN yarn build


### FEATURE REPORTER
# Copy dependencies and source code, then build
COPY --from=deps /feature-reporter/node_modules ./deploy/tools/feature-reporter/node_modules
RUN cd ./deploy/tools/feature-reporter && yarn compile_config
RUN cd ./deploy/tools/feature-reporter &&  yarn build


### ENV VARIABLES CHECKER
# Copy dependencies and source code, then build 
WORKDIR /envs-validator
COPY --from=deps /envs-validator/node_modules ./node_modules
COPY ./deploy/tools/envs-validator .
COPY ./types/envs.ts .
RUN yarn build


# *****************************
# ******* STAGE 3: Run ********
# *****************************
# Production image, copy all the files and run next
FROM node:18-alpine AS runner
RUN apk add --no-cache --upgrade bash

### APP
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /envs-validator/index.js ./envs-validator.js
COPY --from=builder /app/deploy/tools/feature-reporter/index.js ./feature-reporter.js

# Copy scripts and ENVs file
COPY --chmod=+x ./deploy/scripts/entrypoint.sh .
COPY --chmod=+x ./deploy/scripts/replace_envs.sh .
COPY --from=builder /app/.env.production .
COPY --from=builder /app/.env .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENTRYPOINT ["./entrypoint.sh"]

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
