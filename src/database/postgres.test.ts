import {describe, it, jest, expect} from '@jest/globals'
import {Pool} from 'pg'
import config from '../config'

jest.mock('pg', () => {
  return {
    Pool: jest.fn()
  }
})
jest.mock('../config', () => {
  return {database:{connectionString: 'connectionString'}}
})


const mockPool = jest.mocked(Pool)
const mockConfig = jest.mocked(config)

describe('postgres', () => {
  it('should be tested', () => {
    require('./postgres')

    expect(mockPool.mock.instances).toHaveLength(1)
    expect(mockPool).toHaveBeenCalledWith(mockConfig.database)
  })
})