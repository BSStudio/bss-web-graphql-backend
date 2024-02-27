import {describe, expect, it, jest } from "@jest/globals";
import compress from 'koa-compress'

jest.mock('koa-compress')

const mockCompress = jest.mocked(compress)

describe('compress', () => {
  it('should export compress', () => {
    require('./compress');

    expect(mockCompress).toHaveBeenCalledWith({ threshold: 0 })
  })
})
