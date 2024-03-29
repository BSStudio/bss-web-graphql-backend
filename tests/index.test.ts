import {describe, it, vi} from 'vitest'
import koa from 'koa'
import config from '../src/config'
import { bodyParser, compress, helmet, postGraphile } from '../src/middleware'
import { healthRouter } from '../src/router'

vi.mock('koa',  () => ({
    default: vi.fn(args => {
        return {
            use: vi.fn(),
            listen: vi.fn(),
        }
    })
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

const mockKoa = vi.mocked('koa')
const mockConfig = vi.mocked('../src/config')
const mockMiddleware = vi.mocked('../src/middleware')
const mockRouter = vi.mocked('../src/router')

describe.skip('index', () => {
  it('should be tested', async () => {
    await import('../src')



  })
})
