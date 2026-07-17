import { PgSimplifyInflectionPreset } from '@graphile/simplify-inflection'
import { postgraphile } from 'postgraphile'
import { makePgService } from 'postgraphile/adaptors/pg'
import { grafserv } from 'postgraphile/grafserv/koa/v3'
import { makeV4Preset } from 'postgraphile/presets/v4'
import { describe, expect, it, vi } from 'vitest'
import config from '../config.js'
import { postgres } from '../database/index.js'

vi.mock('../config.js', () => ({
  default: {
    schema: 'schema',
    database: { connectionString: 'connectionString' },
    postGraphile: {
      allowExplain: false,
      graphiql: false,
      watchPg: false,
      showErrorStack: false,
    },
  },
}))
vi.mock('postgraphile', () => ({
  postgraphile: vi.fn().mockReturnValue({
    createServ: vi.fn().mockReturnValue({
      addTo: vi.fn().mockResolvedValue(undefined),
    }),
  }),
}))
vi.mock('postgraphile/adaptors/pg', () => ({
  makePgService: vi.fn().mockName('makePgService'),
}))
vi.mock('postgraphile/grafserv/koa/v3', () => ({
  grafserv: vi.fn().mockName('grafserv'),
}))
vi.mock('postgraphile/presets/v4', () => ({
  makeV4Preset: vi.fn().mockName('makeV4Preset'),
}))
vi.mock('@graphile/simplify-inflection', () => ({
  PgSimplifyInflectionPreset: vi.fn().mockName('PgSimplifyInflectionPreset'),
}))
vi.mock('../database/index.js', () => ({
  postgres: vi.fn().mockName('postgres'),
}))

const mockConfig = vi.mocked(config)
const mockPostgraphile = vi.mocked(postgraphile)
const mockMakePgService = vi.mocked(makePgService)
const mockMakeV4Preset = vi.mocked(makeV4Preset)
const mockGrafserv = vi.mocked(grafserv)
const mockPostgres = vi.mocked(postgres)

describe('postgraphile', () => {
  it('should configure PostGraphile v5 with the v4 preset', async () => {
    expect.assertions(5)

    const { addPostGraphile } = await import('./postgraphile.js')
    const mockApp = { use: vi.fn() }
    const mockCreateServ = mockPostgraphile.mock.results[0]?.value.createServ
    const mockServ = mockCreateServ.mock.results[0]?.value

    await addPostGraphile(mockApp as never)

    expect.soft(mockMakeV4Preset).toHaveBeenCalledWith({
      subscriptions: true,
      retryOnInitFail: true,
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      extendedErrors: ['errcode'],
      graphiql: false,
      disableDefaultMutations: true,
      ...mockConfig.postGraphile,
    })
    expect.soft(mockMakePgService).toHaveBeenCalledWith({
      pool: mockPostgres,
      schemas: [mockConfig.schema],
    })
    expect.soft(mockPostgraphile).toHaveBeenCalledOnce()
    expect.soft(mockCreateServ).toHaveBeenCalledWith(mockGrafserv)
    expect.soft(mockServ.addTo).toHaveBeenCalledWith(mockApp, null)
  })
})
