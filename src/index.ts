import koa from 'koa'
import config from './config.js'
import {
  bodyParser,
  compress,
  helmet,
  postGraphile,
} from './middleware/index.js'
import { healthRouter } from './router/index.js'

const app = new koa()
// register middleware
app
  // register common middleware
  .use(bodyParser)
  .use(compress)
  .use(helmet())
  // register health router
  .use(healthRouter.routes())
  .use(healthRouter.allowedMethods())
  // postGraphile middleware
  .use(postGraphile)
  // start server
  .listen(config.port, () => {
    console.log(`Server running on port :${config.port.toString()}`)
  })
