import { describe, expect, it, vi } from 'vitest'
import bodyParser from './bodyparser.js'
import compress from './compress.js'
import { koaHelmet } from './helmet.js'
import postGraphile from './postgraphile.js'

vi.mock('./bodyparser', () => ({
  default: vi.fn().mockName('bodyparser'),
}))
vi.mock('./compress', () => ({
  default: vi.fn().mockName('compress'),
}))
vi.mock('./helmet', () => ({
  koaHelmet: vi.fn().mockName('helmet'),
}))
vi.mock('./postgraphile', () => ({
  default: vi.fn().mockName('postgraphile'),
}))

describe('index', () => {
  it('should export middlewares', async () => {
    expect.assertions(2)

    const actual = await import('./index.js')

    const expected = {
      bodyParser,
      compress,
      koaHelmet,
      postGraphile,
    }
    expect.soft(actual).toMatchObject(expected)
    expect.soft(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort())
  })
})
