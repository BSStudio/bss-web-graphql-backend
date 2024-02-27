import {describe, expect, it, jest} from "@jest/globals";
import bodyParser from './bodyparser'
import compress from './compress'
import helmet from './helmet'
import postGraphile from './postgraphile'

jest.mock('./bodyparser')
jest.mock('./compress')
jest.mock('./helmet')
jest.mock('./postgraphile')

const mockBodyParser = jest.mocked(bodyParser)
const mockCompress = jest.mocked(compress)
const mockHelmet = jest.mocked(helmet)
const mockPostGraphile = jest.mocked(postGraphile)

describe('index', () => {
  it('should export middlewares', () => {
    const actual = require('./index')

    expect(actual).toEqual({
      bodyParser: mockBodyParser,
      compress: mockCompress,
      helmet: mockHelmet,
      postGraphile: mockPostGraphile
    })
  })
})