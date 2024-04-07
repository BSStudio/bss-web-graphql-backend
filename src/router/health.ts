import Router from 'koa-router'
import { postgres } from '../database/index.js'

const router = new Router({
  prefix: '/actuator',
})

router.get('/health', async (ctx) => {
  await postgres
    .query(
      "SELECT table_name FROM information_schema.views WHERE table_schema = 'public'",
    )
    .then(({ rows }) => {
      if (rows.length >= 1) {
        ctx.body = 'UP'
        return
      }
      ctx.body = 'ERROR: no views found in database'
      ctx.status = 500
      return
    })
    .catch(() => {
      ctx.body = 'ERROR: cannot connect to database'
      ctx.status = 500
    })
})

router.get('/ping', (ctx) => {
  ctx.body = 'PONG'
})

export default router
