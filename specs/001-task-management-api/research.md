# Research: Task Management API

## Decisions

### Runtime and module compatibility

- **Decision**: Keep the existing ESM TypeScript setup and target Node.js 22 LTS or newer.
- **Rationale**: The repository already uses `module: nodenext`, `.js` import suffixes, and
  `ts-node/esm`; Node 22 provides a stable runtime baseline without changing module semantics.
- **Alternatives considered**: CommonJS would require broad import and build changes; an older
  Node baseline would constrain the current TypeScript and dependency versions.

### SQLite adapter

- **Decision**: Use `better-sqlite3` behind the asynchronous `TaskRepository` contract, with all
  SQL confined to the infrastructure repository and bound parameters for user input.
- **Rationale**: SQLite is required, the synchronous adapter is simple and reliable for this
  single-process assessment, and the application contract remains replaceable and testable.
- **Alternatives considered**: `sqlite3` adds callback/Promise wrapping and more moving parts;
  Node's built-in SQLite APIs would make the runtime baseline less portable.

### Runtime validation

- **Decision**: Use Zod schemas for create, update, route parameter, query, and environment input.
- **Rationale**: One schema can produce runtime validation and inferred TypeScript types, while
  strict object policies prevent clients from controlling generated fields.
- **Alternatives considered**: Handwritten middleware duplicates rules; Joi or Valibot are viable
  but provide no repository-specific advantage here.

### API documentation

- **Decision**: Store a generated/static OpenAPI contract under `contracts/openapi.yaml` and serve
  it through Swagger UI at `/api/docs`.
- **Rationale**: A checked-in contract is reviewable, testable, and can be kept synchronized with
  the public response and validation shapes.
- **Alternatives considered**: Inline route annotations would couple documentation to controllers;
  a separate documentation server is unnecessary for one service.

### Error and request observability

- **Decision**: Use typed application errors mapped by one final middleware, a request-id
  middleware, and structured Pino logging with redaction of authorization data.
- **Rationale**: This satisfies safe error contracts and correlation without spreading transport
  concerns through services.
- **Alternatives considered**: Ad hoc controller `try-catch` and `console.log` would duplicate
  mapping and violate the constitution's centralized handling and logging requirements.

### Deletion semantics

- **Decision**: `DELETE /api/tasks/:id` returns `204 No Content` with no response body.
- **Rationale**: This is the selected contract in the feature assumptions and avoids two success
  shapes for one operation.
- **Alternatives considered**: `200` with a message is valid constitutionally but less minimal and
  would require a documented success envelope.

### Testing strategy

- **Decision**: Use Vitest for service and repository tests and Supertest against the exported app
  for HTTP flows; inject an in-memory repository for service tests and a temporary SQLite file for
  repository tests.
- **Rationale**: Tests remain deterministic, isolated from the development database, and do not
  require opening a real listening port.
- **Alternatives considered**: Jest is compatible but adds no benefit over the repository's
  TypeScript/ESM setup; network-level tests would make failures slower and less isolated.

## Resolved Clarifications

No unresolved technical clarifications remain. The existing constitution and feature assumptions
fix the endpoint set, status enum, authentication model, persistence expectation, and deletion
response.