# Production image: builds the Next.js app and serves it with `next start`.

# --- Build stage ---------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY frontend_tailwind/package.json frontend_tailwind/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY frontend_tailwind/ ./
RUN npm run build && npm prune --omit=dev

# --- Runtime stage -------------------------------------------------------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000 || exit 1
CMD ["npm", "start"]
