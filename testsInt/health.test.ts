import axios from 'axios'
import { describe, expect, inject, it } from 'vitest'

describe('health', () => {
  const host = inject('host')
  const port = inject('port')
  const client = axios.create({ baseURL: `http://${host}:${port}` })

  it('health should return 200 and UP', async () => {
    expect.assertions(2)

    const actual = await client.get('/actuator/health')

    expect(actual.status).toBe(200)
    expect(actual.data).toBe('UP')
  })
})
