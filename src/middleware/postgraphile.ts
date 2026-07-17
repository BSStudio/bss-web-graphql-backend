import { PgSimplifyInflectionPreset } from '@graphile/simplify-inflection'
import type Koa from 'koa'
import { postgraphile } from 'postgraphile'
import { makePgService } from 'postgraphile/adaptors/pg'
import { grafserv } from 'postgraphile/grafserv/koa/v3'
import { makeV4Preset } from 'postgraphile/presets/v4'
import config from '../config.js'
import { postgres } from '../database/index.js'

const preset: GraphileConfig.Preset = {
  extends: [
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
    }),
  ],
}

const pgl = postgraphile(preset)
const serv = pgl.createServ(grafserv)

export async function addPostGraphile(app: Koa): Promise<void> {
  await serv.addTo(app, null)
}

export default pgl
