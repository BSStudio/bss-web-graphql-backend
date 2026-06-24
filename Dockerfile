FROM node:24-alpine@sha256:f1f2c6ee5140c8a7e94d379a40a9467395be641716126f65aea28aff35dbb196 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /home/node
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile --no-optional --prod

FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile --no-optional
COPY ./src ./src
COPY tsconfig.json ./
RUN pnpm run build

FROM base
# node packages were installed as root, so we need to change the owner to node
RUN chown -R node:node /home/node
USER node:node
COPY --from=builder /home/node/dist ./
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
