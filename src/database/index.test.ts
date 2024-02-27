import {describe, expect, it, jest } from "@jest/globals";
import postgres from './postgres'

jest.mock('./postgres')

const mockPostgres = jest.mocked(postgres)

describe('index', () => {
  it('should export databases', () => {
    const actual = require('./index');

    expect(actual).toEqual({ postgres: mockPostgres });
  })
})