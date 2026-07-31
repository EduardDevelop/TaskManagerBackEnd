# Tasks: Task Management API

**Input**: Design documents from `/specs/001-task-management-api/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/openapi.yaml](./contracts/openapi.yaml), and
[quickstart.md](./quickstart.md)

**Tests**: Included because the specification explicitly requires unit, repository, HTTP,
validation, authentication, error, documentation, and persistence tests.

**Implementation approach**: Replace the current in-memory service incrementally with the planned
Clean Architecture boundaries. Keep the exported application importable for Supertest and compose
SQLite dependencies only during application/server bootstrap.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish dependencies, compiler settings, source boundaries, and delivery scripts.

- [X] T001 Add runtime and development dependencies for SQLite, validation, security headers, OpenAPI UI, structured logging, UUIDs, Vitest, and Supertest in `package.json`
- [X] T002 Update TypeScript compiler settings and scripts for strict checks, Vitest, linting, formatting, and ESM source paths in `tsconfig.json` and `package.json`
- [X] T003 [P] Create the planned domain, application, infrastructure, presentation, shared, and test directories under `src/` and `tests/`
- [X] T004 [P] Add safe environment defaults and local artifact exclusions to `.env.example` and `.gitignore`
- [X] T005 [P] Add the test runner configuration and shared test setup in `vitest.config.ts` and `tests/setup.ts`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement boundaries and infrastructure required by every user story.

**CRITICAL**: No user story implementation can begin until this phase is complete.

- [X] T006 Define the `TaskStatus`, `Task`, create/update DTOs, and query types in `src/shared/constants/task-status.constants.ts`, `src/domain/entities/task.entity.ts`, and `src/application/dto/task.dto.ts`
- [X] T007 Define the technology-independent `TaskRepository` contract in `src/domain/repositories/task.repository.ts`
- [X] T008 [P] Define typed domain, application, validation, authentication, not-found, persistence, timeout, and internal errors in `src/domain/errors/domain.error.ts`, `src/application/errors/application.error.ts`, and `src/shared/errors/app.error.ts`
- [X] T009 [P] Implement centralized environment parsing and startup validation in `src/config/env.ts`
- [X] T010 [P] Implement request-id creation and redacted structured logging interfaces in `src/presentation/http/middleware/request-id.middleware.ts` and `src/shared/logger/logger.ts`
- [X] T011 Implement SQLite connection creation, schema initialization, and shutdown handling in `src/infrastructure/database/sqlite.ts`
- [X] T012 Implement the SQLite repository skeleton and domain row mapping in `src/infrastructure/repositories/sqlite-task.repository.ts`
- [X] T013 Implement shared response presenters and error-envelope mapping in `src/presentation/http/presenters/task.presenter.ts` and `src/presentation/http/middleware/error-handler.middleware.ts`
- [X] T014 Implement the application factory and server composition without opening a port from `src/app.ts` and `src/server.ts`

**Checkpoint**: Foundation ready. User stories can now be implemented and tested independently against the repository/service contracts.

## Phase 3: User Story 1 - Gestionar el ciclo de vida de una tarea (Priority: P1) MVP

**Goal**: Deliver validated task creation, retrieval, update, deletion, and persistence with the
required HTTP response envelopes and status codes.

**Independent Test**: Run the unit and HTTP tests in `tests/unit/task.service.test.ts` and
`tests/integration/tasks.crud.test.ts` against an isolated repository, then verify create, get,
update, delete, missing-resource, timestamps, `Location`, and `204` behavior.

### Tests for User Story 1

- [X] T015 [P] [US1] Add service tests for create, get, update, delete, generated UUIDs, normalization, timestamp preservation, and missing tasks in `tests/unit/task.service.test.ts`
- [X] T016 [P] [US1] Add HTTP contract tests for all five task endpoints, response envelopes, `201 Location`, `404`, and empty delete body in `tests/integration/tasks.crud.test.ts`
- [X] T017 [P] [US1] Add SQLite repository tests for persistence, row mapping, update timestamps, deletion, and missing records in `tests/repository/sqlite-task.repository.test.ts`

### Implementation for User Story 1

- [X] T018 [US1] Implement task creation, retrieval, update, deletion, normalization, UUID generation, and injectable clock behavior in `src/application/services/task.service.ts`
- [X] T019 [US1] Complete SQLite CRUD statements and parameterized row operations in `src/infrastructure/repositories/sqlite-task.repository.ts`
- [X] T020 [US1] Implement task request schemas and body/identifier validation for create and PUT in `src/presentation/http/validators/task.validator.ts` and `src/presentation/http/middleware/validation.middleware.ts`
- [X] T021 [US1] Implement thin CRUD controllers and presenter usage in `src/presentation/http/controllers/tasks.controller.ts` and `src/presentation/http/presenters/task.presenter.ts`
- [X] T022 [US1] Register task routes, middleware ordering, `Location` handling, and `204` deletion in `src/presentation/http/routes/task.routes.ts` and `src/app.ts`

**Checkpoint**: The CRUD MVP is independently functional, persisted through the repository, and covered by unit, repository, and HTTP tests.

## Phase 4: User Story 2 - Consultar y localizar tareas (Priority: P1)

**Goal**: Add case-insensitive text search, validated status filtering, combined queries, and empty-result behavior.

**Independent Test**: Seed tasks with varied titles, descriptions, and statuses; run service and HTTP
query tests for unfiltered, search-only, status-only, combined, empty, and invalid-filter cases.

### Tests for User Story 2

- [X] T023 [P] [US2] Add service tests for blank search normalization, case-insensitive title/description matching, status filtering, and combined queries in `tests/unit/task.service.search.test.ts`
- [X] T024 [P] [US2] Add repository tests for parameterized search, status filtering, combined predicates, and special SQL characters in `tests/repository/sqlite-task.repository.search.test.ts`
- [X] T025 [P] [US2] Add HTTP tests for query parsing, empty collections, invalid status `400`, and collection metadata in `tests/integration/tasks.search.test.ts`

### Implementation for User Story 2

- [X] T026 [US2] Extend query DTOs and validation schemas with bounded search and supported status filters in `src/application/dto/task.dto.ts` and `src/presentation/http/validators/task.validator.ts`
- [X] T027 [US2] Implement parameterized case-insensitive search and status predicates in `src/infrastructure/repositories/sqlite-task.repository.ts`
- [X] T028 [US2] Implement query orchestration and collection totals in `src/application/services/task.service.ts` and `src/presentation/http/presenters/task.presenter.ts`
- [X] T029 [US2] Expose validated query parameters through the list controller and route in `src/presentation/http/controllers/tasks.controller.ts` and `src/presentation/http/routes/task.routes.ts`

**Checkpoint**: Listing, search, status filtering, combined filters, and empty results work without affecting CRUD behavior.

## Phase 5: User Story 3 - Recibir validación y errores previsibles (Priority: P1)

**Goal**: Make all invalid and unexpected request outcomes predictable, correlated, and safe.

**Independent Test**: Exercise invalid bodies, malformed identifiers, malformed JSON, unknown routes,
missing resources, simulated repository failures, and unexpected thrown values through HTTP tests.

### Tests for User Story 3

- [X] T030 [P] [US3] Add validator unit tests for missing/null/non-string/blank/oversized title, invalid description, invalid status, extra generated fields, and invalid identifiers in `tests/unit/task.validator.test.ts`
- [X] T031 [P] [US3] Add error middleware tests for stable codes, field details, request IDs, safe `500`, route-not-found, malformed JSON, and persistence error mapping in `tests/integration/error-handling.test.ts`
- [X] T032 [P] [US3] Add tests proving repository failures and non-Error throws do not expose SQL, paths, secrets, or stack traces in `tests/integration/error-safety.test.ts`

### Implementation for User Story 3

- [X] T033 [US3] Complete strict Zod-style schemas and validation middleware for bodies, route IDs, query parameters, content types, and unknown fields in `src/presentation/http/validators/task.validator.ts` and `src/presentation/http/middleware/validation.middleware.ts`
- [X] T034 [US3] Implement centralized error classification, stable codes, field details, request IDs, safe production messages, and async rejection handling in `src/presentation/http/middleware/error-handler.middleware.ts`
- [X] T035 [US3] Add malformed JSON, unknown-route, unsupported-method, request-size, and timeout handling in `src/presentation/http/middleware/error-handler.middleware.ts`, `src/presentation/http/middleware/timeout.middleware.ts`, and `src/app.ts`
- [X] T036 [US3] Add request ID propagation and structured unexpected-error logging with authorization redaction in `src/presentation/http/middleware/request-id.middleware.ts` and `src/shared/logger/logger.ts`

**Checkpoint**: All documented validation and failure scenarios return safe, consistent responses without process crashes.

## Phase 6: User Story 4 - Proteger y documentar el acceso (Priority: P2)

**Goal**: Add configurable bearer-token protection and make the complete public contract discoverable through Swagger UI.

**Independent Test**: Run HTTP tests with authentication disabled and enabled, verify missing/invalid/valid
credentials, and confirm `/api/docs` serves the OpenAPI contract and security scheme.

### Tests for User Story 4

- [X] T037 [P] [US4] Add authentication tests for disabled mode, missing token, malformed header, invalid token, valid token, and token redaction in `tests/integration/authentication.test.ts`
- [X] T038 [P] [US4] Add documentation tests for `/api/docs`, endpoint coverage, schemas, status codes, query parameters, and bearer security in `tests/integration/openapi.test.ts`

### Implementation for User Story 4

- [X] T039 [US4] Implement configurable bearer-token authentication and timing-safe comparison in `src/presentation/http/middleware/authentication.middleware.ts`
- [X] T040 [US4] Apply authentication consistently to protected task mutations and document the route policy in `src/presentation/http/routes/task.routes.ts` and `src/config/env.ts`
- [X] T041 [US4] Add OpenAPI loading and Swagger UI setup at `/api/docs` using `specs/001-task-management-api/contracts/openapi.yaml` in `src/config/swagger.ts` and `src/app.ts`
- [X] T042 [US4] Keep the checked-in OpenAPI contract synchronized with implemented response envelopes, validation rules, authentication, and deletion behavior in `specs/001-task-management-api/contracts/openapi.yaml`

**Checkpoint**: Authentication can be toggled safely and consumers can discover and exercise the full API contract.

## Phase 7: User Story 5 - Ejecutar y mantener el servicio (Priority: P2)

**Goal**: Make configuration, persistence, test execution, operational behavior, and onboarding reproducible.

**Independent Test**: Configure from `.env.example`, run build/tests, restart with persisted data,
verify security middleware and CORS, and follow the README from a clean checkout.

### Tests for User Story 5

- [X] T043 [P] [US5] Add environment configuration tests for valid defaults, invalid port, missing token when enabled, invalid path, and startup failure in `tests/unit/env.test.ts`
- [X] T044 [P] [US5] Add persistence restart and isolated-database tests in `tests/integration/persistence.test.ts`
- [X] T045 [P] [US5] Add security middleware tests for configured CORS, body-size limits, Helmet headers, and request timeout behavior in `tests/integration/security.test.ts`

### Implementation for User Story 5

- [X] T046 [US5] Implement configured CORS, JSON body limits, Helmet, timeout, startup initialization, and graceful shutdown in `src/app.ts`, `src/config/env.ts`, and `src/server.ts`
- [X] T047 [US5] Add predictable SQLite initialization, migration/schema failure translation, and close handling in `src/infrastructure/database/sqlite.ts`
- [X] T048 [US5] Add package scripts for development, build, start, test, coverage, lint, and formatting in `package.json`
- [X] T049 [US5] Document installation, environment variables, architecture, commands, API examples, SQLite, authentication, CORS, Swagger, filters, and limitations in `README.md`

**Checkpoint**: A developer can configure, run, test, restart, and understand the service without undocumented steps.

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature against the constitution and quickstart before delivery.

- [X] T050 [P] Add final coverage thresholds and ensure tests cover every required acceptance scenario in `vitest.config.ts` and `tests/`
- [X] T051 [P] Review all imports and responsibility boundaries for Express/domain violations, direct environment access, SQL leakage, unjustified `any`, and duplicated validation in `src/`
- [X] T052 [P] Add or update source and test documentation for non-obvious infrastructure decisions in `src/` and `tests/`
- [X] T053 Run `npm run build`, `npm test`, lint, format checks, and the scenarios in `specs/001-task-management-api/quickstart.md`
- [X] T054 Confirm `.env`, SQLite files, logs, and build artifacts are ignored and no secrets or debug output remain in `.gitignore`, `README.md`, and the repository

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T005 can begin immediately, with T003-T005 parallelizable.
- **Foundational (Phase 2)**: Depends on Setup; T006-T014 block all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers the MVP CRUD slice.
- **User Story 2 (Phase 4)**: Depends on Foundational and the task query/repository shape from US1; it can be developed in parallel with US1 only after shared interfaces are stabilized.
- **User Story 3 (Phase 5)**: Depends on Foundational and the controller/route surfaces from US1; validation tests may begin after DTOs exist.
- **User Story 4 (Phase 6)**: Depends on Foundational and the composed app/routes; can proceed in parallel with US2 and US3 after route composition exists.
- **User Story 5 (Phase 7)**: Depends on Foundational and is finalized after the service/repository/app behaviors are present; its configuration tests can start after T009.
- **Polish (Phase 8)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Depends only on Phase 2; no other story dependency.
- **US2 (P1)**: Depends on Phase 2 plus the repository/service interfaces stabilized by US1; preserves US1 CRUD behavior.
- **US3 (P1)**: Depends on Phase 2 plus the HTTP surfaces created in US1; hardens all existing story flows.
- **US4 (P2)**: Depends on Phase 2 and route/app composition; integrates with all protected endpoints but does not change domain rules.
- **US5 (P2)**: Depends on Phase 2 and the completed runtime composition; validates the service as a deliverable.

### Parallel Opportunities

- Setup: T003, T004, and T005 can run in parallel after T001/T002 decisions.
- Foundation: T008, T009, and T010 can run in parallel; T011/T012 can proceed once repository types exist.
- US1: T015, T016, and T017 are parallel test authoring tasks; T018-T021 can be split by layer after tests are established.
- US2: T023-T025 are parallel tests; query schema, repository predicates, and presenter changes can be split after DTO stabilization.
- US3: T030-T032 are parallel tests; error middleware and request-id/logging work can proceed independently once shared errors exist.
- US4: T037 and T038 are parallel tests; authentication and Swagger implementation touch separate files.
- US5: T043-T045 are parallel tests; README and package scripts can proceed independently from runtime hardening.
- Across stories: after Phase 2, separate developers can take US1, US2/US3, and US4/US5, provided shared file ownership is coordinated.

## Independent Test Criteria by Story

- **US1**: CRUD tests pass with an isolated repository; create returns `201` and `Location`, update preserves `id`/`createdAt`, delete returns `204`, and missing resources return `404`.
- **US2**: Search and filter tests pass for title/description, case-insensitivity, whitespace, combined filters, empty results, special characters, and invalid status.
- **US3**: Invalid input and failure tests pass with `400`/`404`/`500` mapping, stable codes, field details, request IDs, and no sensitive internals.
- **US4**: Authentication tests pass in both config modes and `/api/docs` documents all required operations and security behavior.
- **US5**: Build/test commands pass, invalid configuration fails fast, persistence survives restart, security middleware is configured, and README quickstart steps work.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational boundaries and SQLite composition.
3. Complete Phase 3 US1 CRUD and its unit, repository, and HTTP tests.
4. Stop and validate the CRUD flow using `specs/001-task-management-api/quickstart.md`.
5. Demo the persisted task lifecycle before adding search, hardening, and optional authentication.

### Incremental Delivery

1. Add US2 search and filtering, then validate combined query behavior.
2. Add US3 centralized validation and safe errors, then run failure-path tests.
3. Add US4 authentication and Swagger documentation.
4. Add US5 developer experience, security, persistence restart checks, and README.
5. Run Phase 8 gates and the complete quickstart before delivery.

## Notes

- Every task follows the required `- [ ] T### [P?] [US#?] description with file path` format.
- `[P]` marks only tasks that can work on separate files without an incomplete dependency.
- Story labels map to the five user stories in `spec.md`; setup, foundation, and polish tasks have no story label.
- Tests are intentionally included because they are explicit requirements in the feature specification.
- No task introduces user accounts, sessions, distributed services, frontend code, or other listed non-goals.
