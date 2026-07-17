import { describe, expect, it, vi } from 'vitest'
import bodyParser from './bodyparser.js'
import compress from './compress.js'
import { koaHelmet } from './helmet.js'

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
  addPostGraphile: vi.fn().mockName('addPostGraphile'),
}))

describe('index', () => {
  it('should export middlewares', async () => {
    expect.assertions(2)

    const actual = await import('./index.js')
    const { addPostGraphile } = await import('./postgraphile.js')

    const expected = {
      bodyParser,
      compress,
      koaHelmet,
      addPostGraphile,
    }
    expect.soft(actual).toMatchObject(expected)
    expect
      .soft(Object.keys(actual).sort(String.localeCompare))
      .toEqual(Object.keys(expected).sort(String.localeCompare))
  })
})
