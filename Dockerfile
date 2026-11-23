FROM node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS base
# Node 25+ images don't ship Corepack: copy the standalone pnpm binary instead.
# The version must match "packageManager" in package.json; the "Lint Dockerfile" job checks it.
COPY --from=ghcr.io/pnpm/pnpm:12.23.0-alpine@sha256:f0acb1f42d79e8221951554858d4474f3a48f4e287f612ad8bfd4ed874b4ab12 /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /home/node

FROM base AS builder
# pnpm-workspace.yaml holds project settings (allowBuilds) that affect the install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# TypeScript 7 ships platform binaries as optionalDependencies; do not skip them here.
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --store-dir /var/cache/pnpm --ignore-scripts --frozen-lockfile
COPY ./src ./src
COPY tsconfig.json ./
RUN pnpm run build

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --ignore-scripts: no native addons are built, so node_modules is portable to the glibc runtime below
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --store-dir /var/cache/pnpm --ignore-scripts --frozen-lockfile --no-optional --prod

# distroless: no shell, package manager, npm or corepack; runs as the image's non-root user
FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:ffa8a7545403036c94ec76674b5dbac2d425af2d679147cdf3e30180071487b7 AS runtime
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
