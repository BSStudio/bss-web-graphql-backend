FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS base
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
FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:6abfcb367ebc291572c774c1592a986be2ab26a2486f73093401327495a5962a AS runtime
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
