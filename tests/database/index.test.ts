import {describe, expect, it, vi } from "vitest";
import postgres from '../../src/database/postgres.js'

vi.mock('../../src/database/postgres')
vi.mock('../../src/config', () => ({
  default: {
    database: {}
  }
}))

const mockPostgres = vi.mocked(postgres)

describe('index', () => {
  it('should export databases', async () => {
    const actual = await import('../../src/database/index.js');

    expect(actual).toMatchObject({ postgres: mockPostgres });
  })
})