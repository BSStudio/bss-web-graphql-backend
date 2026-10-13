FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /home/node

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
# TypeScript 7 ships platform binaries as optionalDependencies; do not skip them here.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile
COPY ./src ./src
COPY tsconfig.json ./
RUN pnpm run build

FROM base AS runtime
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile --no-optional --prod
# - pick up OS security fixes published after the base image was built
# - drop the npm CLI bundled with Node: the app never runs it, but its vendored dependencies show up in image scans
# - node packages were installed as root, so we need to change the owner to node
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
    && chown -R node:node /home/node
# node:24-alpine defines the node user as UID/GID 1000; numeric USER avoids hadolint DL3066
USER 1000:1000
COPY --from=builder /home/node/dist ./
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
