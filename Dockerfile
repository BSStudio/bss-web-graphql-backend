FROM node:22-alpine@sha256:cb3143549582cc5f74f26f0992cdef4a422b22128cb517f94173a5f910fa4ee7 AS base
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
