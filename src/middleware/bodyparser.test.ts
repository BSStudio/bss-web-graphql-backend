import bodyParser from '@koa/bodyparser'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@koa/bodyparser')
const mockBodyParser = vi.mocked(bodyParser)

describe('bodyparser', () => {
  it('should export bodyparser', async () => {
    expect.assertions(1)

    const { default: actual } = await import('./bodyparser.js')

    expect(actual).toBe(mockBodyParser())
  })
})
