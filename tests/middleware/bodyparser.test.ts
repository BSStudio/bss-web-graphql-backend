import { describe, expect, it, vi } from 'vitest'
import bodyParser from 'koa-bodyparser'

vi.mock('koa-bodyparser')
const mockBodyParser = vi.mocked(bodyParser)

describe('bodyparser', () => {
  it('should export bodyparser', async () => {
    await import('../../src/middleware/bodyparser.js')

    expect(mockBodyParser).toHaveBeenCalledWith()
  })
})
