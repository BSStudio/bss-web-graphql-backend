import { describe, afterAll, it, expect } from 'vitest'
import supertest from 'supertest'
import healthRouter from '../../src/router/health.js'
import koa from 'koa'

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
    it('should return OK', async () => {
      expect.assertions(2)

      const actual = await supertest(server).get('/actuator/health')

      expect(actual.text).toBe('OK')
      expect(actual.status).toBe(200)
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
