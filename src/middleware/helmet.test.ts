import helmet from 'helmet'
import { describe, expect, it, vi } from 'vitest'

vi.mock('helmet')

describe('helmet', () => {
  it('should export helmet', async () => {
    expect.assertions(2)

    const { default: actual } = await import('./helmet.js')

    expect(helmet).toHaveBeenCalledOnce()
    expect(actual).toStrictEqual(helmet)
  })
})
