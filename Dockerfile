FROM node:24-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS base
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

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# --ignore-scripts: no native addons are built, so node_modules is portable to the glibc runtime below
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts --frozen-lockfile --no-optional --prod

# distroless: no shell, package manager, npm or corepack; runs as the image's non-root user
FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:55de7e48a8414e7aff825207c0b3c0f7db3b10133efc50d748560c27c9053be1 AS runtime
USER 65532:65532
WORKDIR /home/nonroot
# files stay root-owned, so the app cannot modify them; package.json sets "type": "module"
COPY package.json ./
COPY --from=deps /home/node/node_modules ./node_modules
COPY --from=builder /home/node/dist ./
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD ["/nodejs/bin/node", "-e", "fetch('http://localhost:3000/actuator/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
ENTRYPOINT ["/nodejs/bin/node", "index.js"]
