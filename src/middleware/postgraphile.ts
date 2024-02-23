import { Pool } from 'pg'
import config from '../config'
import { postgraphile, PostGraphileOptions } from 'postgraphile'

const pool = new Pool({
  ...config.database,
})

const postGraphileOptions: PostGraphileOptions = {
  subscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  extendedErrors: ['errcode'],
  appendPlugins: [require('@graphile-contrib/pg-simplify-inflector')],
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true,
  legacyRelations: 'omit',
}

export default postgraphile(pool, config.database.schema, postGraphileOptions)
