FROM node:24-alpine@sha256:6ad8c47f099bc2440e0fc42f17a03297fa79955f559f10087cabf377c43ddbce AS base
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
