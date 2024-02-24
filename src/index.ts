import koa from 'koa'
import config from './config'
import { bodyParser, cache, compress, helmet } from './middleware'
import { healthRouter } from './router'

const app = new koa()
// register middleware
app
  // register common middleware
  .use(bodyParser)
  .use(compress)
  .use(helmet)
  .use(cache)
  // temp enable caching for all routes
  .use(async (ctx, next) => {
    if (await ctx.cashed()) return
    await next()
  })
  // register health router
  .use(healthRouter.routes())
  .use(healthRouter.allowedMethods())
  // start server
  .listen(config.port, () => {
    console.log(`Server running on port :${config.port}`)
  })
