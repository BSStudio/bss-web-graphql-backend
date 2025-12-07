import helmet, { type HelmetOptions } from 'helmet'
import type { Middleware } from 'koa'

/**
 * Koa-compatible Helmet middleware.
 *
 * Accepts the same options helmet() does.
 */
export default function (options?: HelmetOptions): Middleware {
  const expressHelmet = helmet(options)
  return async (ctx, next) => {
    await new Promise<void>((resolve, reject) => {
      expressHelmet(ctx.req, ctx.res, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
    return next()
  }
}
