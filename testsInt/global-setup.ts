import path from "path";
import {DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait} from "testcontainers";
import {GlobalSetupContext} from "vitest/node";

declare module 'vitest' {
    export interface ProvidedContext {
        host: string
        port: number
    }
}

declare global {
    var compose: StartedDockerComposeEnvironment
}

const BUILD_CONTEXT = path.resolve(__dirname, './../')
const COMPOSE_FILES = ['docker-compose.yml', 'docker-compose.ci.yml']

export async function setup({provide}: GlobalSetupContext) {
    const dockerComposeEnvironment = new DockerComposeEnvironment(
        BUILD_CONTEXT,
        COMPOSE_FILES,
    )
        .withWaitStrategy('graphql-1', Wait.forHealthCheck())
        .withWaitStrategy('backend-1', Wait.forHealthCheck())
        .withWaitStrategy('db-1', Wait.forHealthCheck())
    const startedDockerComposeEnvironment = await dockerComposeEnvironment.up()
    const graphqlContainer = startedDockerComposeEnvironment.getContainer('graphql-1');
    provide('host', graphqlContainer.getHost())
    provide('port', graphqlContainer.getMappedPort(3000))
    globalThis.compose = startedDockerComposeEnvironment
}

export async function teardown() {
    await globalThis.compose.down()
}
