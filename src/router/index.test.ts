import { describe, expect, it, jest } from '@jest/globals'
import healthRouter from './health'

jest.mock('./health')

const mockHealthRouter = jest.mocked(healthRouter)

describe('index', () => {
  it('should export routers', () => {
    const actual = require('./index');

    expect(actual).toEqual({ healthRouter: mockHealthRouter });
  })
})
