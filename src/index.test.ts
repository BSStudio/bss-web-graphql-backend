import koa from 'koa'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import config from './config.js'
import {
  bodyParser,
  compress,
  helmet,
  postGraphile,
} from './middleware/index.js'
import { healthRouter } from './router/index.js'

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
vi.mock('./config.js', () => ({
  default: {
    port: 1234,
  },
}))
vi.mock('./middleware/index.js', () => ({
  bodyParser: vi.fn().mockName('bodyParser'),
  compress: vi.fn().mockName('compress'),
  helmet: vi
    .fn()
    .mockName('helmet')
    .mockReturnValue(vi.fn().mockName('helmet-middleware')),
  postGraphile: vi.fn().mockName('postGraphile'),
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
    expect.assertions(13)

    await import('./index.js')

    expect.soft(vi.mocked(koa)).toHaveBeenCalledTimes(1)
    const mockKoaInstance = vi.mocked(koa).mock.results[0]?.value
    // assert use method is called 6 times with the following arguments
    expect.soft(mockKoaInstance.use).toHaveBeenCalledTimes(6)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(bodyParser)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(compress)
    expect.soft(helmet).toHaveBeenCalledWith()
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(helmet())
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
