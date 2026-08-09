import { createServer } from 'node:http'
import koa from 'koa'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import config from './config.js'
import {
  addPostGraphile,
  bodyParser,
  compress,
  koaHelmet,
} from './middleware/index.js'
import { healthRouter } from './router/index.js'

const { mockServerListen } = vi.hoisted(() => ({
  mockServerListen: vi
    .fn()
    .mockImplementation((_port, cb: CallableFunction) => cb()),
}))

vi.mock('node:http', () => ({
  createServer: vi.fn().mockReturnValue({
    listen: mockServerListen,
  }),
}))
vi.mock('koa', () => ({
  default: vi.fn(
    class {
      use = vi.fn().mockReturnThis()
      callback = vi.fn().mockReturnValue(vi.fn().mockName('koa-handler'))
    },
  ),
}))
vi.mock('./config.js', () => ({
  default: {
    port: 1234,
  },
}))
vi.mock('./middleware/index.js', () => ({
  bodyParser: vi.fn().mockName('bodyParser'),
  compress: vi.fn().mockName('compress'),
  koaHelmet: vi
    .fn()
    .mockName('koaHelmet')
    .mockReturnValue(vi.fn().mockName('helmet-middleware')),
  addPostGraphile: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('./router/index.js', () => ({
  healthRouter: {
    routes: vi.fn().mockName('healthRouter.routes'),
    allowedMethods: vi.fn().mockName('healthRouter.allowedMethods'),
  },
}))

describe('index', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.console, 'log').mockImplementation(() => {})
  })

  it('should be tested', async () => {
    expect.assertions(14)

    await import('./index.js')

    expect.soft(vi.mocked(koa)).toHaveBeenCalledTimes(1)
    const mockKoaInstance = vi.mocked(koa).mock.results[0]?.value
    const mockServer = vi.mocked(createServer).mock.results[0]?.value
    expect.soft(mockKoaInstance.use).toHaveBeenCalledTimes(5)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(bodyParser)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(compress)
    expect.soft(koaHelmet).toHaveBeenCalledWith()
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(koaHelmet())
    expect.soft(healthRouter.routes).toHaveBeenCalledOnce()
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(healthRouter.routes())
    expect.soft(healthRouter.allowedMethods).toHaveBeenCalledOnce()
    expect
      .soft(mockKoaInstance.use)
      .toHaveBeenCalledWith(healthRouter.allowedMethods())
    expect.soft(createServer).toHaveBeenCalledWith(mockKoaInstance.callback())
    expect
      .soft(addPostGraphile)
      .toHaveBeenCalledWith(mockKoaInstance, mockServer)
    expect
      .soft(mockServerListen)
      .toHaveBeenCalledWith(config.port, expect.any(Function))
    expect
      .soft(globalThis.console.log)
      .toHaveBeenCalledWith('Server running on port :1234')
  })
})
