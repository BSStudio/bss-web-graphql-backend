# BSS web graphQL backend

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
