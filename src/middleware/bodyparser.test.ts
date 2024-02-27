import { describe, expect, it } from '@jest/globals'
import bodyParser from 'koa-bodyparser'
import {jest} from "@jest/globals";

jest.mock('koa-bodyparser')
const mockBodyParser = jest.mocked(bodyParser)

describe('bodyparser', () => {
  it('should export bodyparser', () => {
    require('./bodyparser')

    expect(mockBodyParser).toHaveBeenCalledWith()
  })
})
