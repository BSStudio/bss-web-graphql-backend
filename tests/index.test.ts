import koa from 'koa'
import { describe, expect, it, vi } from 'vitest'
import config from '../src/config.js'
import {
  bodyParser,
  compress,
  helmet,
  postGraphile,
} from '../src/middleware/index.js'
import { healthRouter } from '../src/router/index.js'

vi.mock('koa', () => ({
  default: vi.fn(
    class {
      use = vi.fn().mockReturnThis()
      listen = vi
        .fn()
        .mockImplementation((_port: number, cb: CallableFunction) => cb())
    },
  ),
}))
vi.mock('../src/config.js', () => ({
  default: {
    port: 1234,
  },
}))
vi.mock('../src/middleware/index.js', () => ({
  bodyParser: vi.fn().mockName('bodyParser'),
  compress: vi.fn().mockName('compress'),
  helmet: vi.fn().mockName('helmet'),
  postGraphile: vi.fn().mockName('postGraphile'),
}))
vi.mock('../src/router/index.js', () => ({
  healthRouter: {
    routes: vi.fn().mockName('healthRouter.routes'),
    allowedMethods: vi.fn().mockName('healthRouter.allowedMethods'),
  },
}))
vi.spyOn(globalThis.console, 'log').mockImplementation(() => {})

describe('index', () => {
  it('should be tested', async () => {
    expect.assertions(12)

    await import('../src/index.js')

    expect.soft(vi.mocked(koa)).toHaveBeenCalledTimes(1)
    const mockKoaInstance = vi.mocked(koa).mock.results[0]?.value
    // assert use method is called 6 times with the following arguments
    expect.soft(mockKoaInstance.use).toHaveBeenCalledTimes(6)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(bodyParser)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(compress)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(helmet)
    expect.soft(healthRouter.routes).toHaveBeenCalledOnce()
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(healthRouter.routes())
    expect.soft(healthRouter.allowedMethods).toHaveBeenCalledOnce()
    expect
      .soft(mockKoaInstance.use)
      .toHaveBeenCalledWith(healthRouter.allowedMethods())
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(postGraphile)
    expect
      .soft(mockKoaInstance.listen)
      .toHaveBeenCalledWith(config.port, expect.any(Function))
    expect
      .soft(globalThis.console.log)
      .toHaveBeenCalledWith('Server running on port :1234')
  })
})
