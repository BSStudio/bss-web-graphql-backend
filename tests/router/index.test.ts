import { describe, expect, it, vi } from 'vitest'
import healthRouter from '../../src/router/health'

vi.mock('../../src/router/health')

const mockHealthRouter = vi.mocked(healthRouter)

describe('index', () => {
  it('should export routers', async () => {
    const actual = await import('../../src/router')

    expect(actual).toMatchObject({ healthRouter: mockHealthRouter });
  })
})
