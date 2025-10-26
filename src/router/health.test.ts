import koa from 'koa'
import supertest from 'supertest'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { postgres } from '../database/index.js'
import healthRouter from './health.js'

vi.mock('./index.js', () => ({
  postgres: {
    query: vi.fn(),
  },
}))

const mockedPostgres = vi.mocked(postgres)

describe('health', () => {
  const server = new koa()
    .use(healthRouter.routes())
    .use(healthRouter.allowedMethods())
    .listen()

  // eslint-disable-next-line vitest/no-hooks
  afterAll(() => {
    server.close()
  })

  describe('/health', () => {
    it('should return 200 and UP', async () => {
      expect.assertions(2)
      // eslint-disable-next-line vitest/prefer-mock-promise-shorthand
      mockedPostgres.query.mockImplementation(() =>
        Promise.resolve({ rows: [{ table_name: 'test' }] }),
      )

      const actual = await supertest(server).get('/actuator/health')

      expect(actual.text).toBe('UP')
      expect(actual.status).toBe(200)
    })
    it('should return 500 and ERROR when view is empty', async () => {
      expect.assertions(2)
      // eslint-disable-next-line vitest/prefer-mock-promise-shorthand
      mockedPostgres.query.mockImplementation(() =>
        Promise.resolve({ rows: [] }),
      )

      const actual = await supertest(server).get('/actuator/health')

      expect(actual.text).toBe('ERROR: no views found in database')
      expect(actual.status).toBe(500)
    })
    it('should return 500 and ERROR when db is not connected', async () => {
      expect.assertions(2)
      mockedPostgres.query.mockRejectedValue(new Error('error'))

      const actual = await supertest(server).get('/actuator/health')

      expect(actual.text).toBe('ERROR: cannot connect to database')
      expect(actual.status).toBe(500)
    })
  })
  describe('/ping', () => {
    it('should return PONG', async () => {
      expect.assertions(2)

      const actual = await supertest(server).get('/actuator/ping')

      expect(actual.text).toBe('PONG')
      expect(actual.status).toBe(200)
    })
  })
})
