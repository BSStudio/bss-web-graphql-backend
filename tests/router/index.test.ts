import { describe, expect, it, vi } from 'vitest'
import healthRouter from '../../src/router/health.js'

vi.mock('../../src/router/health.js', () => ({
  default: vi.fn(),
}))

const mockHealthRouter = vi.mocked(healthRouter)

describe('index', () => {
  it('should export routers', async () => {
    expect.assertions(1)

    const actual = await import('../../src/router/index.js')

    // todo use strictEqual
    expect(actual).toMatchObject({ healthRouter: mockHealthRouter })
  })
})
