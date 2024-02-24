import config from '../config'
import { postgraphile, PostGraphileOptions } from 'postgraphile'
import database from '../database'

const postGraphileOptions: PostGraphileOptions = {
  subscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  extendedErrors: ['errcode'],
  appendPlugins: [require('@graphile-contrib/pg-simplify-inflector')],
  graphiql: true,
  enableQueryBatching: true,
  disableQueryLog: true,
  legacyRelations: 'omit',
}

export default postgraphile(
  database.postgres,
  config.database.schema,
  postGraphileOptions,
)
