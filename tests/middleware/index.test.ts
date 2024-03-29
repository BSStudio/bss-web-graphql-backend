import {describe, expect, it, vi} from "vitest";
import bodyParser from '../../src/middleware/bodyparser'
import compress from '../../src/middleware/compress'
import helmet from '../../src/middleware/helmet'
import postGraphile from '../../src/middleware/postgraphile'

vi.mock('../../src/middleware/bodyparser', () => ({default: {}}))
vi.mock('../../src/middleware/compress', () => ({default: {}}))
vi.mock('../../src/middleware/helmet', () => ({default: {}}))
vi.mock('../../src/middleware/postgraphile', () => ({default: {}}))

const mockBodyParser = vi.mocked(bodyParser)
const mockCompress = vi.mocked(compress)
const mockHelmet = vi.mocked(helmet)
const mockPostGraphile = vi.mocked(postGraphile)

describe('index', () => {
  it('should export middlewares', async () => {
    const actual = await import('../../src/middleware')

    expect(actual).toMatchObject({
      bodyParser: mockBodyParser,
      compress: mockCompress,
      helmet: mockHelmet,
      postGraphile: mockPostGraphile
    })
  })
})