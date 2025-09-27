# BSS web graphQL backend

[![Build](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/build.yml/badge.svg)](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/build.yml)
[![Release](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/release.yml/badge.svg)](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/release.yml)
[![Docker](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/docker.yml/badge.svg)](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/docker.yml)
[![CodeQL](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/BSStudio/bss-web-graphql-backend/actions/workflows/github-code-scanning/codeql)
![GitHub Release Date](https://img.shields.io/github/release-date/BSStudio/bss-web-graphql-backend)
![GitHub Tag](https://img.shields.io/github/v/tag/BSStudio/bss-web-graphql-backend)
![GitHub branch checks state](https://img.shields.io/github/checks-status/BSStudio/bss-web-graphql-backend/main)
![Codecov branch](https://img.shields.io/codecov/c/gh/BSStudio/bss-web-graphql-backend/main)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/BSStudio/bss-web-graphql-backend)
![GitHub](https://img.shields.io/github/license/BSStudio/bss-web-graphql-backend)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=bugs)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=code_smells)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=ncloc)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=alert_status)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=security_rating)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=sqale_index)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=BSStudio_bss-web-graphql-backend&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=BSStudio_bss-web-graphql-backend)



This project exposes public information for the BSS website.
It uses [Postgraphile][postgraphile] to expose a GraphQL API.

## Development

### Prerequisites

* [Node.js][node]: use [nvm][nvm] to install the correct version
* [Docker][docker]

### Run database
```bash
# Go to the bss-web-admin-backend project
# Or clone it if you haven't already
cd ..
git clone git@github.com:BSStudio/bss-web-admin-backend.git
cd bss-web-admin-backend
# Run the admin backend and the database
docker compose up -d --build
# Wait for the app to initialize the database
# Stop the app, mock-file-api (keeping the database only)
docker compose down app mock-file-api
```

### Build & run project

```bash
npm install
npm run build
npm run start
```

Look at the [environment variables section][env] to see how to configure the project.

### Start development server

```bash
npm run dev
```

Look at the [environment variables section][env] to see how to configure the project.

### Run tests

```bash
npm run test
```

### Lint code

```bash
npm run lint
# or
npm run lint:fix
```

### Build docker image

```bash
docker build -t bss-web-public-backend .
docker run -p 3000:3000 bss-web-public-backend
```

Look at the [environment variables section][env] to see how to configure the project.

## Environment variables

The following environment variables are used to configure the project:
You can set them using a .env file or by setting them in the environment.

| Name                          | Default/required | Description                                    |
|-------------------------------|------------------|------------------------------------------------|
| PORT                          | 3000             | The port the server listens on                 |
| DATABASE_CONNECTION_STRING    | ⚠️️ Required ⚠️  | The connection string to the Postgres database |
| DATABASE_SCHEMA               | 'public'         | The schema to use in the database              |
| POSTGRAPHILE_GRAPHIQL         | false            | Show GraphiQL interface                        |
| POSTGRAPHILE_WATCH_PG         | false            | Apply changes to the schema automatically      |
| POSTGRAPHILE_SHOW_ERROR_STACK | false            | Show error stack traces                        |

[postgraphile]: https://www.graphile.org/postgraphile/ "Postgraphile website"

[node]: https://nodejs.org/ "Node.js website"

[nvm]: https://github.com/nvm-sh/nvm "nvm GitHub repository"

[docker]: https://www.docker.com/ "Docker website"

[env]: #environment-variables "Environment variables section"
