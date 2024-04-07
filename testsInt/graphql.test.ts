import { describe, expect, it, inject } from 'vitest'
import { gql, GraphQLClient } from 'graphql-request'

interface Query {
  __schema: { types: [{ name: string }] }
}

describe('graphql', () => {
  const host = inject('host')
  const port = inject('port')
  const client = new GraphQLClient(`http://${host}:${port}/graphql`)

  it('health should return 200 and UP', async () => {
    expect.assertions(1)

    const request = gql`
      query Query {
        __schema {
          types {
            name
          }
        }
      }
    `

    const actual = await client.request<Query>(request)

    expect(actual).toStrictEqual({
      __schema: {
        types: expect.arrayContaining([
          { name: 'Event' },
          { name: 'EventVideo' },
          { name: 'Video' },
          { name: 'Crew' },
          { name: 'Member' },
        ]),
      },
    })
  })
})
