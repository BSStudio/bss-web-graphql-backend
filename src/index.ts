import koa from 'koa'
import config from './config'
import { bodyParser, compress, postGraphile } from './middleware'
import { healthRouter } from './router'

const app = new koa()
// register middleware
app.use(compress)
app.use(bodyParser)
app.use(postGraphile)
// register router
app.use(healthRouter.routes())
app.use(healthRouter.allowedMethods())
// start server
app.listen(config.port, () => {
  console.log(`Server running on port :${config.port}`)
})
