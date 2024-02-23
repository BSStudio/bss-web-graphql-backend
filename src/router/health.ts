import Router from 'koa-router'

const router = new Router({
  prefix: '/actuator',
})

router.get('/health', (ctx) => {
  ctx.body = 'OK'
})

router.get('/ping', (ctx) => {
  ctx.body = 'PONG'
})

export default router
