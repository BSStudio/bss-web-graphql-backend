import Router from "koa-router";

const router = new Router({
  prefix: '/actuator'
});

router.get('/health', async (ctx) => {
  ctx.body = 'OK';
});

router.get('/ping', async (ctx) => {
  ctx.body = 'PONG';
});

export default router;
