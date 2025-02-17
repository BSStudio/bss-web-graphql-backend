FROM node:22-alpine AS base
WORKDIR /home/node
COPY package.json package-lock.json ./
RUN npm clean-install --ignore-scripts --no-fund --no-audit --omit=optional --omit=dev

FROM base AS builder
RUN npm clean-install --ignore-scripts --no-fund --no-audit --omit=optional
COPY ./src ./src
COPY tsconfig.json ./
RUN npm run build

FROM base
# node packages were installed as root, so we need to change the owner to node
RUN chown -R node:node /home/node
USER node:node
COPY --from=builder /home/node/dist ./
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
LABEL org.opencontainers.image.source="https://github.com/BSStudio/bss-web-graphql-backend"
LABEL org.opencontainers.image.description="BSS Web GraphQL backend"
LABEL org.opencontainers.image.licenses="GPL-3.0"
