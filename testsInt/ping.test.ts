import { describe, expect, it, inject } from 'vitest'
import axios from 'axios'

describe('ping', () => {
  const host = inject('host')
  const port = inject('port')
  const client = axios.create({ baseURL: `http://${host}:${port}` })

  it('ping should return 200 and PONG', async () => {
    expect.assertions(2)

    const actual = await client.get('/actuator/ping')

    expect(actual.status).toBe(200)
    expect(actual.data).toBe('PONG')
  })
})
