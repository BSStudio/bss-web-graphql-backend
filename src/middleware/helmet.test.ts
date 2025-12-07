import helmet from 'helmet'
import type { Context } from 'koa'
import { describe, expect, it, vi } from 'vitest'

vi.mock('helmet')

describe('helmet', () => {
  it('should export a function that wraps helmet for Koa', async () => {
    expect.assertions(2)

    const { default: helmetMiddleware } = await import('./helmet.js')

    expect(helmetMiddleware).toBeTypeOf('function')

    // Call the function to create middleware
    const middleware = helmetMiddleware()

    expect(middleware).toBeTypeOf('function')
  })

  it('should call helmet with options when provided', async () => {
    expect.assertions(1)

    const mockHelmet = vi.mocked(helmet)
    mockHelmet.mockReturnValue(vi.fn())

    const { default: helmetMiddleware } = await import('./helmet.js')

    const options = { contentSecurityPolicy: false }
    helmetMiddleware(options)

    expect(mockHelmet).toHaveBeenCalledWith(options)
  })

  it('should call the express helmet middleware and continue to next', async () => {
    expect.assertions(2)

    const mockExpressHelmet = vi.fn((_req, _res, next) => {
      next()
    })
    const mockHelmet = vi.mocked(helmet)
    mockHelmet.mockReturnValue(mockExpressHelmet)

    const { default: helmetMiddleware } = await import('./helmet.js')

    const middleware = helmetMiddleware()

    const ctx = {
      req: {},
      res: {},
    } as Context
    const next = vi.fn().mockResolvedValue(undefined)

    await middleware(ctx, next)

    expect(mockExpressHelmet).toHaveBeenCalledWith(
      ctx.req,
      ctx.res,
      expect.any(Function),
    )
    expect(next).toHaveBeenCalledOnce()
  })

  it('should reject promise when express helmet middleware returns error', async () => {
    expect.assertions(2)

    const error = new Error('Helmet error')
    const mockExpressHelmet = vi.fn((_req, _res, callback) => {
      callback(error)
    })
    const mockHelmet = vi.mocked(helmet)
    mockHelmet.mockReturnValue(mockExpressHelmet)

    const { default: helmetMiddleware } = await import('./helmet.js')

    const middleware = helmetMiddleware()

    const ctx = {
      req: {},
      res: {},
    } as Context
    const next = vi.fn()

    await expect(middleware(ctx, next)).rejects.toThrow('Helmet error')
    expect(next).not.toHaveBeenCalled()
  })
})
