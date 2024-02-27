import { afterAll, describe, expect, it, jest } from '@jest/globals'
import supertest from 'supertest'
import healthRouter from './health'
import koa from "koa";

describe('health', () => {

  const server = new koa()
    .use(healthRouter.routes())
    .use(healthRouter.allowedMethods())
    .listen();

  afterAll(() => {
    server.close();
  })

  describe('/health', () => {

    it('should return OK', () => {
      return supertest(server).get('/actuator/health').expect(200, 'OK');
    });
  })
  describe('/ping', () => {

    it('should return PONG', () => {
      return supertest(server).get('/actuator/ping').expect(200, 'PONG');
    });
  })
})