import { postgraphile } from 'postgraphile'
import { describe, expect, it, vi } from 'vitest'
import config from '../../src/config.js'
import { postgres } from '../../src/database/index.js'

vi.mock('../../src/config.js', () => ({
  default: {
    schema: 'schema',
    postGraphile: vi.fn().mockName('config.postGraphile'),
  },
}))
vi.mock('postgraphile', () => ({
  postgraphile: vi.fn().mockName('postgraphile'),
}))
vi.mock('../../src/database/index.js', () => ({
  postgres: vi.fn().mockName('postgres'),
}))

const mockConfig = vi.mocked(config)
const mockPostgraphile = vi.mocked(postgraphile)
const mockPostgres = vi.mocked(postgres)

describe('postgraphile', () => {
  it('should be tested', async () => {
    expect.assertions(3)

    const { default: actual } = await import(
      '../../src/middleware/postgraphile.js'
    )

    expect.soft(mockPostgraphile).toHaveBeenCalledOnce()
    expect
      .soft(mockPostgraphile)
      .toHaveBeenCalledWith(mockPostgres, mockConfig.schema, {
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
        disableDefaultMutations: true,
        ...config.postGraphile,
      })
    expect.soft(actual).toStrictEqual(mockPostgraphile())
  })
})
