# Implementation Plan: Task Management API

**Branch**: `001-task-management-api` | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-task-management-api/spec.md`

**Note**: This template is filled in by the `$speckit-plan` command; its definition describes the execution workflow.

## Summary

Deliver a maintainable REST API for task CRUD, search, filtering, validation, safe error handling,
optional bearer authentication, SQLite persistence, OpenAPI documentation, and automated tests.
The implementation will replace the current in-memory singleton with a dependency-injected service
and repository boundary while keeping `app.ts` importable without opening a network port.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9 on Node.js 22 LTS or newer

**Primary Dependencies**: Express 5, SQLite adapter, Zod, CORS, Helmet, Swagger UI/OpenAPI,
Pino, UUID

**Storage**: SQLite file at configurable `DATABASE_PATH`, with an isolated test database or
in-memory repository for unit tests

**Testing**: Vitest for unit tests and Supertest for HTTP integration tests; TypeScript build and
lint/format checks are delivery gates

**Target Platform**: Node.js server on local development and standard Linux/Windows development
environments

**Project Type**: HTTP web service

**Performance Goals**: At least 95% of list/search requests over 1,000 reference tasks complete
within 1 second under normal local conditions

**Constraints**: Strict TypeScript; no unjustified `any`; parameterized SQL; safe errors; body
size and request timeout limits; no application source access to `process.env`; no real network
port required for HTTP tests

**Scale/Scope**: One deployable backend, one task entity, five required endpoints, optional shared
token authentication, one local SQLite database, and no frontend or user-account system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Architecture**: PASS. Domain/application contracts will remain independent of Express and
  SQLite; controllers will delegate to services and repositories will own persistence.
- **Dependency direction**: PASS. Presentation depends on application/domain contracts;
  infrastructure implements repository contracts; bootstrap composes dependencies.
- **Typing and validation**: PASS. Strict TypeScript and runtime schemas cover all external input;
  errors use `unknown` and typed application errors.
- **REST and response contract**: PASS. The design fixes `DELETE` at `204 No Content`, uses stable
  error codes, ISO timestamps, `Location` on creation, and documented status codes.
- **Persistence and security**: PASS. SQLite uses parameterized queries, configurable paths,
  safe startup validation, configured CORS, body limits, timeouts, security headers, and optional
  bearer authentication.
- **Testing and documentation**: PASS. Unit, repository, HTTP, authentication, error, and
  documentation checks are planned; quickstart and OpenAPI contracts are included.
- **Complexity**: PASS. Repository, service, validation, and middleware boundaries directly map to
  explicit constitution requirements and do not add unrelated infrastructure.

### Post-Design Re-evaluation

- **Architecture and dependency direction**: PASS. The source tree assigns SQL to infrastructure,
  use-case orchestration to application services, and HTTP adaptation to presentation; bootstrap
  composition remains outside those layers.
- **Public contracts**: PASS. [openapi.yaml](./contracts/openapi.yaml) defines all five endpoints,
  UUID validation, task status values, response envelopes, error responses, bearer security, and
  the selected `204` deletion behavior.
- **Domain and persistence integrity**: PASS. [data-model.md](./data-model.md) preserves generated
  identifiers and timestamps, defines valid transitions, and requires parameterized persistence.
- **Validation, security, and observability**: PASS. [research.md](./research.md) resolves the
  validation, authentication, request-id, logging, timeout, CORS, and safe-error decisions without
  adding out-of-scope identity or deployment infrastructure.
- **Testing and developer experience**: PASS. [quickstart.md](./quickstart.md) provides build,
  test, CRUD, invalid-input, authentication, documentation, and restart-persistence checks.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── config/
│   ├── env.ts
│   └── swagger.ts
├── domain/
│   ├── entities/task.entity.ts
│   ├── repositories/task.repository.ts
│   └── errors/domain.error.ts
├── application/
│   ├── dto/task.dto.ts
│   ├── services/task.service.ts
│   └── errors/application.error.ts
├── infrastructure/
│   ├── database/sqlite.ts
│   └── repositories/sqlite-task.repository.ts
├── presentation/http/
│   ├── controllers/tasks.controller.ts
│   ├── routes/task.routes.ts
│   ├── middleware/
│   │   ├── authentication.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   ├── request-id.middleware.ts
│   │   ├── timeout.middleware.ts
│   │   └── validation.middleware.ts
│   ├── presenters/task.presenter.ts
│   └── validators/task.validator.ts
├── shared/
│   ├── errors/app.error.ts
│   ├── logger/logger.ts
│   └── constants/task-status.constants.ts
├── app.ts
└── server.ts
tests/
├── unit/task.service.test.ts
├── integration/tasks.api.test.ts
└── repository/sqlite-task.repository.test.ts
```

**Structure Decision**: Use one backend project with explicit domain, application,
infrastructure, presentation, and shared boundaries. The existing `src/models`, `src/services`,
`src/controllers`, and `src/middleware` files will be migrated into these ownership boundaries;
the frontend remains outside this repository feature.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | The selected boundaries are required by the constitution and feature scope. |
