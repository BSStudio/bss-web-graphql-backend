import type { Server } from 'node:http'
import { PgSimplifyInflectionPreset } from '@graphile/simplify-inflection'
import type Koa from 'koa'
import { postgraphile } from 'postgraphile'
import { makePgService } from 'postgraphile/adaptors/pg'
import { grafserv } from 'postgraphile/grafserv/koa/v3'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makeV4Preset } from 'postgraphile/presets/v4'
import config from '../config.js'
import { postgres } from '../database/index.js'

const preset: GraphileConfig.Preset = {
  extends: [
    PostGraphileAmberPreset,
    makeV4Preset({
      // production defaults from:
      // https://www.graphile.org/postgraphile/usage-library/#for-production
      subscriptions: true,
      retryOnInitFail: true,
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      extendedErrors: ['errcode'],
      graphiql: false,
      disableDefaultMutations: true,
      ...config.postGraphile,
    }),
    PgSimplifyInflectionPreset,
  ],
  pgServices: [
    makePgService({
      pool: postgres,
      schemas: [config.schema],
      pubsub: true,
    }),
  ],
}

export async function addPostGraphile(app: Koa, server: Server): Promise<void> {
  const pgl = postgraphile(preset)
  await pgl.createServ(grafserv).addTo(app, server)
}
