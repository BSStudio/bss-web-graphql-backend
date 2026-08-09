import koa from 'koa'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addPostGraphile } from './middleware/index.js'

vi.mock('node:http', () => ({
  createServer: vi.fn().mockReturnValue({
    listen: vi.fn(),
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
  addPostGraphile: vi.fn().mockRejectedValue(new Error('PostGraphile failed')),
}))
vi.mock('./router/index.js', () => ({
  healthRouter: {
    routes: vi.fn().mockName('healthRouter.routes'),
    allowedMethods: vi.fn().mockName('healthRouter.allowedMethods'),
  },
}))

describe('index error handling', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.console, 'error').mockImplementation(() => {})
    vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit called')
    }) as never)
  })

  it('should exit when PostGraphile fails to start', async () => {
    expect.assertions(3)

    await expect(import('./index.js')).rejects.toThrow('process.exit called')

    expect(globalThis.console.error).toHaveBeenCalledWith(
      'Failed to start PostGraphile:',
      expect.objectContaining({ message: 'PostGraphile failed' }),
    )
    expect(vi.mocked(addPostGraphile)).toHaveBeenCalledOnce()
  })
})
