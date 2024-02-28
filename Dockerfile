FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm clean-install --ignore-scripts --no-fund --no-audit --omit=dev

FROM base AS builder
RUN npm clean-install --ignore-scripts --no-fund --no-audit
COPY ./ ./
RUN npm run build

FROM base
COPY --from=builder /app/dist ./
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
