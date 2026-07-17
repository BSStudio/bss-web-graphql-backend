// biome-ignore-all lint/complexity/useLiteralKeys: index signature
import dotenv from 'dotenv'
import type { PgAdaptorMakePgServiceOptions } from 'postgraphile/adaptors/pg'
import type { V4Options } from 'postgraphile/presets/v4'

export interface Config {
  port: number
  database: Pick<PgAdaptorMakePgServiceOptions, 'connectionString'>
  schema: string
  postGraphile: Pick<
    V4Options,
    'allowExplain' | 'graphiql' | 'watchPg' | 'showErrorStack'
  >
}

dotenv.configDotenv()

if (process.env['DATABASE_CONNECTION_STRING'] === undefined) {
  throw new Error('DATABASE_CONNECTION_STRING is not set')
}

// Please update the environment variables documentation in the README.md file
const config: Config = {
  port: Number(process.env['PORT']) || 3000,
  database: {
    connectionString: process.env['DATABASE_CONNECTION_STRING'],
  },
  schema: process.env['DATABASE_SCHEMA'] || 'public',
  postGraphile: {
    allowExplain: process.env['POSTGRAPHILE_ALLOW_EXPLAIN'] === 'true',
    graphiql: process.env['POSTGRAPHILE_GRAPHIQL'] === 'true',
    watchPg: process.env['POSTGRAPHILE_WATCH_PG'] === 'true',
    showErrorStack: process.env['POSTGRAPHILE_SHOW_ERROR_STACK'] === 'true',
  },
}

export default config
