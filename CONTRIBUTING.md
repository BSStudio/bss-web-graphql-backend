# Contributing

Members of the BSS video studio maintain this project. Anyone can report a bug or suggest an
improvement in the [issue tracker](https://github.com/BSStudio/bss-web-graphql-backend/issues).

## Reporting a vulnerability

Don't open a public issue. Report it privately through
[GitHub private vulnerability reporting](https://github.com/BSStudio/bss-web-graphql-backend/security/advisories/new).
The [security policy](https://github.com/BSStudio/bss-web-graphql-backend/security/policy) explains what happens next.

## Pull requests

Open a pull request against `main`. A change is accepted when:

- The title follows [Conventional Commits](https://www.conventionalcommits.org/). Releases and
  release notes are generated from it.
- `biome check` passes. See [Lint code](README.md#lint-code).
- New or changed behaviour comes with tests, and unit-test statement coverage stays at 100%
  (enforced in `vitest.config.ts`).
- The integration tests pass (`test:int` in `package.json`).

Pull requests are squash-merged through the merge queue once the required checks pass.
