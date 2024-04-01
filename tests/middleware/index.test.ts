import { describe, expect, it, vi } from 'vitest'
import bodyParser from '../../src/middleware/bodyparser.js'
import compress from '../../src/middleware/compress.js'
import helmet from '../../src/middleware/helmet.js'
import postGraphile from '../../src/middleware/postgraphile.js'

vi.mock('../../src/middleware/bodyparser', () => ({
  default: vi.fn().mockName('bodyparser'),
}))
vi.mock('../../src/middleware/compress', () => ({
  default: vi.fn().mockName('compress'),
}))
vi.mock('../../src/middleware/helmet', () => ({
  default: vi.fn().mockName('helmet'),
}))
vi.mock('../../src/middleware/postgraphile', () => ({
  default: vi.fn().mockName('postgraphile'),
}))

const mockBodyParser = vi.mocked(bodyParser)
const mockCompress = vi.mocked(compress)
const mockHelmet = vi.mocked(helmet)
const mockPostGraphile = vi.mocked(postGraphile)

describe('index', () => {
  it('should export middlewares', async () => {
    expect.assertions(2)

    const actual = await import('../../src/middleware/index.js')

    const expected = {
      bodyParser: mockBodyParser,
      compress: mockCompress,
      helmet: mockHelmet,
      postGraphile: mockPostGraphile,
    }
    expect.soft(actual).toMatchObject(expected)
    expect.soft(Object.keys(actual)).toEqual(Object.keys(expected))
  })
})
