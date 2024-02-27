import {describe, expect, it, jest } from "@jest/globals";
import helmet from 'koa-helmet'

jest.mock('koa-helmet')

const mockHelmet = jest.mocked(helmet)

describe('helmet', () => {
  it('should export helmet', () => {
    require('./helmet');

    expect(mockHelmet).toHaveBeenCalledWith()
  })
})
