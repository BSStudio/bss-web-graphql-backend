import {describe, it, vi} from 'vitest'

vi.mock('../../src/config', () => ({
  default: {
    schema: 'schema',
    postGraphile: {}
  }
}))

describe('postgraphile', () => {
  it('should be tested', async () => {
    await import('../../src/middleware/postgraphile')
  })
})
