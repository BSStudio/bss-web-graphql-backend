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
  default: vi.fn(() => ({
    use: vi.fn().mockName('use').mockReturnThis(),
    listen: vi
      .fn()
      .mockName('listen')
      .mockImplementation((_port, cb) => cb()),
  })),
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

const mockKoa = vi.mocked(koa)
const mockConfig = vi.mocked(config)
const mockBodyParser = vi.mocked(bodyParser)
const mockCompress = vi.mocked(compress)
const mockHelmet = vi.mocked(helmet)
const mockPostGraphile = vi.mocked(postGraphile)
const mockHealthRouter = vi.mocked(healthRouter)

vi.spyOn(global.console, 'log').mockImplementation(() => {})

describe('index', () => {
  it('should be tested', async () => {
    expect.assertions(12)

    await import('../src/index.js')

    expect.soft(mockKoa.mock.results).toHaveLength(1)
    const mockKoaInstance = mockKoa.mock.results[0].value
    // assert use method is called 6 times with the following arguments
    expect.soft(mockKoaInstance.use).toHaveBeenCalledTimes(6)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(mockBodyParser)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(mockCompress)
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(mockHelmet)
    expect.soft(mockHealthRouter.routes).toHaveBeenCalledOnce()
    expect
      .soft(mockKoaInstance.use)
      .toHaveBeenCalledWith(mockHealthRouter.routes())
    expect.soft(mockHealthRouter.allowedMethods).toHaveBeenCalledOnce()
    expect
      .soft(mockKoaInstance.use)
      .toHaveBeenCalledWith(mockHealthRouter.allowedMethods())
    expect.soft(mockKoaInstance.use).toHaveBeenCalledWith(mockPostGraphile)
    expect
      .soft(mockKoaInstance.listen)
      .toHaveBeenCalledWith(mockConfig.port, expect.any(Function))
    expect
      .soft(global.console.log)
      .toHaveBeenCalledWith('Server running on port :1234')
  })
})
