FROM node:24-alpine@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8 AS base
# standalone pnpm binary; keep the version in sync with "packageManager" in package.json
COPY --from=ghcr.io/pnpm/pnpm:12.16.1-alpine@sha256:3b67e34454e18e4797a50ade3176dde31cec13ad6670f460a81bdf6e1d8b547b /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /home/node

FROM base AS builder
# pnpm-workspace.yaml holds project settings that affect the install
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
    pnpm install --store-dir /var/cache/pnpm --ignore-scripts --frozen-lockfile \
    --no-optional --prod

# distroless: no shell, package manager, npm or corepack; runs as the image's non-root user
FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:088a01637f22908632ba09018be2e0b516f2fa6f7869c191d29491139db43c78 AS runtime
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
