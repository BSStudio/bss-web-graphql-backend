import {describe, expect, it, vi} from 'vitest'
import koa from 'koa'
import config from '../src/config.js'
import { bodyParser, compress, helmet, postGraphile } from '../src/middleware/index.js'
import { healthRouter } from '../src/router/index.js'

vi.mock('koa',  () => ({
    default: vi.fn(() => ({
        use: vi.fn().mockReturnThis(),
        listen: vi.fn()
    }))
}))
vi.mock('../src/config', () => ({
  default: {
    port: 1234,
  }
}))
vi.mock('../src/middleware', () => ({
    bodyParser: {},
    compress: {},
    helmet: {},
    postGraphile: {},
}))
vi.mock('../src/router')

const mockKoa = vi.mocked(koa)
const mockConfig = vi.mocked(config)
const mockBodyParser = vi.mocked(bodyParser)
const mockCompress = vi.mocked(compress)
const mockHelmet = vi.mocked(helmet)
const mockPostGraphile = vi.mocked(postGraphile)
const mockHealthRouter = vi.mocked(healthRouter)

describe('index', () => {
  it('should be tested', async () => {
    await import('../src/index.js')
  })
})
