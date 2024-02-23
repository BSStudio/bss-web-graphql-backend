interface Config {
  port: number
  database: {
    url: string
    port: number
    schema: string
    password: string
    user: string
  }
}

if (process.env.DB_USER === undefined) {
  throw new Error('DB_USER is not set')
}

if (process.env.DB_PASSWORD === undefined) {
  throw new Error('DB_PASSWORD is not set')
}

if (process.env.DB_SCHEMA === undefined) {
  throw new Error('DB_SCHEMA is not set')
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  database: {
    url: process.env.DATABASE_URL || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    schema: process.env.DB_SCHEMA,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
}

export default config