import path from 'node:path'
import {
  DockerComposeEnvironment,
  type StartedDockerComposeEnvironment,
  Wait,
} from 'testcontainers'
import type { TestProject } from 'vitest/node'

declare module 'vitest' {
  export interface ProvidedContext {
    host: string
    port: number
  }
}

const BUILD_CONTEXT = path.resolve(__dirname, './../')
const COMPOSE_FILES = ['docker-compose.yml', 'docker-compose.ci.yml']

let compose: StartedDockerComposeEnvironment | undefined

export async function setup(project: TestProject) {
  const dockerComposeEnvironment = new DockerComposeEnvironment(
    BUILD_CONTEXT,
    COMPOSE_FILES,
  )
    .withWaitStrategy('graphql-1', Wait.forHealthCheck())
    .withWaitStrategy('backend-1', Wait.forHealthCheck())
    .withWaitStrategy('db-1', Wait.forHealthCheck())
  compose = await dockerComposeEnvironment.up()
  const graphqlContainer = compose.getContainer('graphql-1')
  project.provide('host', graphqlContainer.getHost())
  project.provide('port', graphqlContainer.getMappedPort(3000))
}

export async function teardown() {
  if (!compose) return
  await compose.down()
}
