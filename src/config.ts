import dotenv from 'dotenv'
import { PostGraphileOptions } from 'postgraphile'
import { PoolConfig } from 'pg'

dotenv.config()

interface Config {
  port: number
  database: PoolConfig
  schema: string
  postGraphile: PostGraphileOptions
}

if (process.env.DATABASE_CONNECTION_STRING === undefined) {
  throw new Error('DATABASE_CONNECTION_STRING is not set')
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  database: {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  },
  schema: process.env.DATABASE_SCHEMA || 'public',
  postGraphile: {
    graphiql: process.env.POSTGRAPHILE_GRAPHIQL === 'true',
    watchPg: process.env.POSTGRAPHILE_WATCH_PG === 'true',
    showErrorStack: process.env.POSTGRAPHILE_SHOW_ERROR_STACK === 'true',
  },
}

export default config
