import config from '../config.js'
import { postgraphile, PostGraphileOptions } from 'postgraphile'
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'
import { postgres } from '../database/index.js'

const options: PostGraphileOptions = {
  // production defaults from:
  // https://www.graphile.org/postgraphile/usage-library/#for-production
  subscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  extendedErrors: ['errcode'],
  appendPlugins: [PgSimplifyInflectorPlugin.default],
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true,
  legacyRelations: 'omit',
  disableDefaultMutations: true,
  ...config.postGraphile,
}

export default postgraphile(postgres, config.schema, options)
