import { describe, expect, it, vi } from 'vitest'
import postgres from './postgres.js'

vi.mock('./postgres.js', () => ({
  default: vi.fn(),
}))

const mockPostgres = vi.mocked(postgres)

describe('index', () => {
  it('should export databases', async () => {
    expect.assertions(2)

    const actual = await import('./index.js')

    const expected = { postgres: mockPostgres }
    expect.soft(actual).toMatchObject(expected)
    expect.soft(Object.keys(actual)).toEqual(Object.keys(expected))
  })
})
