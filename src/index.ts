import koa from 'koa'
import config from './config'
import { bodyParser, compress, helmet, postGraphile } from './middleware'
import { healthRouter } from './router'

console.log(config)

const app = new koa()
// register middleware
app
  // register common middleware
  .use(bodyParser)
  .use(compress)
  .use(helmet)
  // register health router
  .use(healthRouter.routes())
  .use(healthRouter.allowedMethods())
  // postgraphile middleware
  .use(postGraphile)
  // start server
  .listen(config.port, () => {
    console.log(`Server running on port :${config.port}`)
  })
