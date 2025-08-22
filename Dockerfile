# syntax=docker.io/docker/dockerfile:1
FROM node:22-alpine AS base

# ===== DEPENDENCY STAGE ===== :cite[1]:cite[9]
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# ===== BUILDER STAGE ===== :cite[3]:cite[4]
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_DATABASE_URL
ARG OPENAI_API_KEY
ARG CRON_SECRET
ENV NEXT_PUBLIC_DATABASE_URL=$NEXT_PUBLIC_DATABASE_URL
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV CRON_SECRET=$CRON_SECRET

RUN \
    if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

# ===== PRODUCTION STAGE ===== :cite[2]:cite[6]
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
