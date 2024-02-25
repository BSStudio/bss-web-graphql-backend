import koa from 'koa'
import config from './config'
import { bodyParser, cache, compress, helmet, postGraphile } from './middleware'
import { healthRouter } from './router'
import stringify from 'fast-safe-stringify'

const app = new koa()
// register middleware
app
  // register common middleware
  .use(bodyParser)
  .use(compress)
  .use(helmet)
  .use(cache)
  // register health router
  .use(healthRouter.routes())
  .use(healthRouter.allowedMethods())
  // postgraphile middleware
  .use(({ request }, next) => {
    console.log(`${request.method} ${request.url} ${stringify(request.body)}`)
    return next()
  })
  .use(postGraphile)
  // start server
  .listen(config.port, () => {
    console.log(`Server running on port :${config.port}`)
  })
