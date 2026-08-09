import { createServer } from 'node:http'
import koa from 'koa'
import config from './config.js'
import {
  addPostGraphile,
  bodyParser,
  compress,
  koaHelmet,
} from './middleware/index.js'
import { healthRouter } from './router/index.js'

const app = new koa()
// register middleware
app
  // register common middleware
  .use(bodyParser)
  .use(compress)
  .use(koaHelmet())
  // register health router
  .use(healthRouter.routes())
  .use(healthRouter.allowedMethods())

const server = createServer(app.callback())

try {
  await addPostGraphile(app, server)
} catch (error) {
  console.error('Failed to start PostGraphile:', error)
  process.exit(1)
}

// start server
server.listen(config.port, () => {
  console.log(`Server running on port :${config.port.toString()}`)
})
