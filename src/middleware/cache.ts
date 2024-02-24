import koaCash, { Options } from 'koa-cash'
import redis from '../database/redis'
import stringify from 'fast-safe-stringify'

// koa types does not have a method property
// todo remove custom types when @types/koa-cash is updated
const options: Options & { methods: { [key: string]: boolean } } = {
  compression: true,
  setCachedHeader: true,
  maxAge: 2 * 60, // 2 minutes in seconds
  hash(ctx) {
    return `${ctx.req.method} ${ctx.req.url}`
  },
  get: async (key, maxAge) => {
    return redis.getex(key, 'EX', maxAge).then((str) => {
      if (str === null) return null
      return JSON.parse(str)
    })
  },
  set: async (key, value, maxAge) => {
    const val = stringify(value)
    await redis.setex(key, maxAge, val)
  },
  methods: {
    GET: true,
    HEAD: true,
    POST: true,
  },
}

export default koaCash(options)
