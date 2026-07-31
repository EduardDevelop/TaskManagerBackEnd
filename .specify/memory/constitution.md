<!--
Sync Impact Report
- Version change: template/unversioned -> 1.0.0
- Modified principles: none; all 22 principles are newly established.
- Added sections: Required API Use Cases, Edge Cases, Non-Goals, Implementation Priorities,
  Definition of Done, and Quality Gates.
- Removed sections: none.
- Follow-up TODOs: none.
-->

# Task Management Backend Constitution

## Purpose

This constitution defines the mandatory architectural, technical, security, quality, testing,
and documentation principles for the Task Management backend.

The backend MUST provide a maintainable, secure, testable, and documented REST API for listing,
retrieving, creating, updating, deleting, searching, and filtering tasks. It MUST validate
external input, persist task information, handle expected and unexpected errors, support
optional header authentication, and expose configuration through environment variables.

The Angular frontend, visual interface, reactive forms, user notifications, loading indicators,
and modal behavior are outside this constitution's scope.

---

# Core Principles

## I. Clean Architecture with Pragmatic Boundaries

The backend MUST use a simplified Clean Architecture organized by responsibility and dependency
direction. It MUST separate domain models and rules, application services, infrastructure,
HTTP presentation, middleware, configuration, and bootstrap concerns.

The domain and application layers MUST NOT depend on Express. Routes MUST NOT contain business
logic, controllers MUST NOT access databases directly, repository interfaces MUST be independent
of database technology, and the application bootstrap MUST be separate from HTTP server startup.
The architecture MUST remain proportional to project size; abstractions MUST solve real
responsibility boundaries and files MUST NOT exist only to simulate enterprise complexity.

Rationale: Pragmatic boundaries provide testability without overengineering a small assessment.

## II. Dependency Rule

Dependencies MUST point toward the domain and application core. The allowed direction is
Presentation -> Application -> Domain, with Infrastructure depending on Application and Domain,
and Bootstrap depending on all required layers.

Domain entities MUST NOT import HTTP libraries, environment variables, or infrastructure.
Application services MUST depend on repository abstractions. Concrete repositories MUST implement
domain contracts, cross-layer circular dependencies are prohibited, and infrastructure details
MUST be replaceable without modifying business rules.

Rationale: The dependency rule protects business logic from framework and persistence changes.

## III. Single Responsibility

Every module, class, function, and file MUST have one primary reason to change. Routes define
paths, methods, and middleware registration; controllers adapt HTTP input and output; application
services coordinate use cases and rules; repositories persist data; middleware handles
cross-cutting HTTP concerns.

Controllers MUST remain thin. Routes MUST NOT contain business logic. Repositories MUST NOT
choose HTTP status codes. Services MUST NOT receive Express Request or Response objects. Validation
schemas MUST NOT be duplicated across controllers, and utility modules MUST NOT become unrelated
function containers.

Rationale: Clear responsibility boundaries reduce coupling and improve testability.

## IV. Clean Code

Code MUST prioritize clarity, correctness, and maintainability over cleverness. It MUST use
descriptive names, cohesive functions, guard clauses, explicit side effects, and domain-specific
values. It MUST avoid duplication, deep nesting, unexplained magic values, dead code, commented-out
implementations, excessive parameters, mixed abstraction levels, mutable global state, swallowed
errors, and inconsistent response structures.

Comments MUST explain non-obvious decisions, workarounds, or unusual necessary implementations;
they MUST NOT merely repeat code.

Rationale: Clean code is an explicit technical-assessment quality requirement.

## V. Strong TypeScript Typing

The backend MUST use strict TypeScript settings, including `strict`, `noImplicitAny`,
`strictNullChecks`, `noUncheckedIndexedAccess`, `noImplicitReturns`, and
`noFallthroughCasesInSwitch` where supported by the toolchain.

`any` is prohibited except for unavoidable documented external integrations. Request data,
parameters, queries, service results, repositories, and errors MUST be typed. Untrusted caught
values MUST use `unknown`. External input MUST still be validated at runtime. Type assertions MUST
NOT bypass unresolved type problems. Status values MUST use a strongly typed union or equivalent,
and public functions SHOULD declare explicit return types.

The canonical statuses are `pending`, `in_progress`, and `done`. DTOs MUST distinguish create,
update, query, and response contracts.

Rationale: Compile-time typing improves reliability while runtime validation protects trust
boundaries.

## VI. Domain Integrity

Tasks MUST have a backend-generated unique `id`, a trimmed non-blank `title` of 1-100 meaningful
characters, an optional `description` of at most 500 characters, a supported status, and backend-
generated `createdAt` and `updatedAt` timestamps.

Clients MUST NOT define authoritative identifiers or timestamps. Empty descriptions MAY normalize
to `null`. `createdAt` MUST remain unchanged after creation, `updatedAt` MUST change after a
successful update, updates MUST NOT create missing tasks, and deletes of missing tasks MUST return
`404`.

Rationale: Domain invariants keep persisted data valid independently of the frontend.

## VII. Runtime Input Validation

All untrusted bodies, route parameters, query parameters, authentication headers, enum values,
lengths, required fields, and unsupported fields MUST be validated before application logic.
A runtime library such as Zod, Joi, Valibot, or an equivalent MAY be used.

Create requests MUST require a trimmed string title of 1-100 meaningful characters and a valid
status; descriptions are optional strings of at most 500 characters. PUT requests MUST validate a
complete body with required title and status. Identifiers MUST be non-empty and, when UUIDs are
used, valid UUIDs. Malformed identifiers and invalid filters MUST return `400`; valid missing
identifiers MUST return `404`. Supported query fields MUST be explicit and pagination values MUST
be positive integers when pagination exists.

Rationale: Runtime validation prevents invalid data from reaching domain or persistence layers.

## VIII. REST API Semantics

The required endpoints are `GET /api/tasks`, `GET /api/tasks/:id`, `POST /api/tasks`,
`PUT /api/tasks/:id`, and `DELETE /api/tasks/:id`.

List returns `200` and an empty array when empty. Get returns `200`, `400`, or `404` as
appropriate. Create returns `201`, the created task, and a `Location` header. Update returns
`200` or `400`/`404`. Delete returns one documented success status, either `200` with a success
response or `204`, and returns `400`/`404` as appropriate.

Validation failures MUST return `400`, missing resources MUST NOT return `400`, authentication
failures MUST return `401`, timeouts MUST return `408` or a documented equivalent, and unexpected
failures MUST return a safe `500`. Stack traces MUST NOT be returned.

Rationale: Consistent HTTP semantics are explicit evaluation criteria.

## IX. Consistent API Responses

Successful and failed responses MUST use documented, consistent structures. Success responses MUST
identify success and carry task data; collections MUST carry data and total metadata when the
contract defines it. Errors MUST identify failure with a stable machine-readable code and a
human-readable message. Validation errors SHOULD include field details and errors SHOULD include a
request identifier.

Dates MUST be ISO 8601. Persistence internals, stack traces, and other implementation details
MUST NOT be exposed. One operation MUST NOT return unrelated response shapes. The contract MUST be
documented in Swagger/OpenAPI and the README.

Rationale: Stable response contracts simplify integration and debugging.

## X. Centralized Error Handling

Errors MUST flow through centralized Express error middleware that distinguishes validation,
identifier, not-found, authentication, persistence, timeout, and unexpected errors.

Controllers MUST forward errors. Expected failures MUST use typed operational errors. Unexpected
failures MUST produce safe `500` responses and be logged. Production responses MUST not expose
stacks. Request identifiers MUST be preserved. Database errors MUST be translated to safe
application errors, and promise rejections MUST be handled. Explicit controller `try-catch` or a
reusable async wrapper is permitted, but the selected approach MUST be documented.

Rationale: Central handling prevents duplicated mapping logic and makes failures predictable.

## XI. Persistence Abstraction

Tasks MUST be persisted through a technology-independent repository abstraction. SQLite SHOULD be
the default implementation for local relational persistence, while tests SHOULD use an in-memory
repository or isolated database.

Application services MUST depend on the repository contract. SQL MUST remain in infrastructure,
use bound parameters, and never appear in controllers. Database setup and reproducible schema
creation or migrations MUST be documented. Database artifacts MUST be appropriately ignored, and
repository failures MUST become safe application errors. Identifiers and timestamps MUST be
preserved accurately.

Rationale: Repository abstraction supports isolated tests and replaceable persistence.

## XII. Search and Filtering

`GET /api/tasks` SHOULD support case-insensitive search over title and description and filtering by
validated status. Leading and trailing search whitespace MUST be ignored. Invalid filters MUST
return `400` without server errors. SQLite filtering MUST occur in the repository, and user input
MUST use bound parameters rather than SQL concatenation.

Optional sorting and pagination MAY be supported when explicitly documented. The unfiltered
endpoint MUST remain valid.

Rationale: Search and filtering satisfy an assessment criterion and exercise safe querying.

## XIII. Environment Configuration

Runtime configuration MUST be centralized and environment-driven. A committed `.env.example` MUST
define safe values for `NODE_ENV`, `PORT`, `API_PREFIX`, `DATABASE_PATH`, `CORS_ORIGIN`,
`REQUEST_TIMEOUT_MS`, `AUTH_ENABLED`, `API_TOKEN`, and `LOG_LEVEL` as applicable.

`.env` MUST NOT be committed. Startup MUST validate configuration and fail fast on invalid required
values. Safe local defaults MAY be used. Secrets MUST NOT appear in source or logs. Business logic
MUST NOT read `process.env` directly.

Rationale: Centralized configuration improves portability and satisfies the configuration
requirement.

## XIV. Basic Header Authentication

Optional authentication SHOULD be an isolated middleware using a configured bearer token or API
key. With authentication disabled, routes operate normally; when enabled, missing or invalid
credentials return `401`.

The token MUST come from environment configuration, MUST NOT be logged or returned, and MUST remain
outside controllers and services. Swagger and README MUST document placeholder-based usage. User
accounts, sessions, password storage, and unnecessary identity complexity are out of scope. A
timing-safe comparison SHOULD be used when practical.

Rationale: A configurable header token satisfies the authentication extra without full identity
infrastructure.

## XV. Security Baseline

The backend MUST apply a basic security baseline: configured CORS, a JSON body-size limit, request
timeouts, secure headers such as `helmet` when available, and authentication middleware when
enabled.

CORS MUST use the configured frontend origin. SQL MUST be parameterized. Errors MUST not reveal
paths, queries, secrets, or stacks. Incoming objects MUST NOT be blindly merged into entities,
prototype-pollution risks MUST be avoided, unsupported methods MUST NOT crash the process, and
unnecessary technology-identifying headers SHOULD be disabled.

Rationale: Small services still require secure defaults.

## XVI. Logging and Observability

The backend SHOULD provide structured operational logs containing timestamp, level, method, path,
status, duration, request identifier, and safe error metadata. Requests SHOULD receive unique
identifiers and error responses SHOULD include them.

Authorization headers, tokens, passwords, and secrets MUST NOT be logged. Validation failures MUST
NOT be logged as critical failures. Unexpected failures MUST include useful diagnostic context,
and temporary debug logs MUST be removed before delivery. `console.log` MUST NOT be the primary
production logging strategy.

Rationale: Structured logs improve traceability without exposing sensitive information.

## XVII. API Documentation

The API MUST be documented with Swagger/OpenAPI or an equivalent generated specification. It MUST
document title, description, server URL, authentication, task and request schemas, status values,
success and error responses, query parameters, examples, and expected status codes for every task
endpoint. Documentation MUST be available at a documented route such as `/api/docs` or `/docs`.

Documentation MUST match implementation, use non-sensitive examples, and be linked from README.
Swagger configuration MUST NOT duplicate domain constants unnecessarily.

Rationale: Documentation is an explicit deliverable and integration contract.

## XVIII. Automated Testing

Automated tests MUST cover application service listing, retrieval, missing resources, valid and
invalid creation, update, missing update, deletion, missing deletion, status filtering, and text
search. Controller or integration tests SHOULD cover routes, methods, status codes, response
shapes, validation, errors, authentication, Swagger, and filters. Repository tests SHOULD cover
persistence, updates, deletion, search, filtering, and timestamps.

Tests MUST be deterministic, isolated from production data, behavior-focused, and documented. HTTP
tests SHOULD use an Express app instance without opening a network port; unit tests SHOULD use an
in-memory repository. Vitest or Jest and Supertest are recommended.

Rationale: Focused automated tests demonstrate boundaries and reduce regression risk.

## XIX. Data and Time Handling

Identifiers SHOULD use UUIDs. Dates MUST be generated by the backend, stored consistently, and
returned as ISO 8601 UTC timestamps. `createdAt` is assigned at creation and never changes;
`updatedAt` initially corresponds to it and changes on successful updates.

Client timestamps MUST be rejected or ignored according to validation. Formatting MUST occur at a
serialization boundary, and date tests SHOULD use controlled clocks where practical.

Rationale: Consistent time and identifier handling prevents subtle persistence defects.

## XX. Controllers Must Remain Thin

Controllers MAY extract validated parameters, call one application service method, set a response
header, return a success response, and forward errors. Controllers MUST NOT execute SQL, generate
business identifiers, duplicate schema validation, decide repository details, build entities from
unvalidated input, repeat error mapping, import SQLite, read environment variables, or perform
unrelated logging.

Rationale: HTTP adapters remain reusable and independently testable when kept thin.

## XXI. Service Layer Business Orchestration

Services MUST implement list, get, create, update, and delete workflows without returning Express
responses or knowing concrete repositories. They MUST verify required existence, normalize input,
preserve invariants, create identifiers and timestamps through injectable utilities or factories,
throw typed not-found errors, and support dependency injection through constructors or factories.

Rationale: Services centralize use-case behavior independently of HTTP and persistence.

## XXII. README and Developer Experience

README MUST enable another developer to install, configure, run, test, build, and understand the
backend. It MUST document technologies and versions, Node.js and package manager requirements,
environment setup, development and production commands, tests, linting and formatting, API and
Swagger URLs, authentication, SQLite setup, folder structure, architecture and dependency flow,
examples, status codes, filters, decisions, extras, limitations, improvements, and CORS.

Rationale: Developer documentation is an explicit deliverable and quality signal.

---

# Required API Use Cases

## List Tasks

The endpoint MUST validate query parameters, apply optional search and status filters, retrieve
through the repository, return `200`, return an empty collection when appropriate, and translate
persistence failures into safe errors.

## Retrieve Task

The endpoint MUST validate the identifier, call the service, return `200` when found, `404` when
absent, and `400` when malformed.

## Create Task

The endpoint MUST authenticate when enabled, validate and normalize input, generate the identifier
and timestamps, persist through the service, return `201`, set `Location`, and return `400` for
invalid input.

## Update Task

The endpoint MUST authenticate when enabled, validate identifier and complete body, verify
existence, preserve `id` and `createdAt`, update `updatedAt`, persist, return `200`, and return
`400` or `404` as appropriate.

## Delete Task

The endpoint MUST authenticate when enabled, validate the identifier, verify existence, delete
through the service, return the documented success status, return `404` when absent, and return a
safe server error on persistence failure.

---

# Edge Cases

The backend MUST produce predictable non-crashing responses for empty databases, malformed or
missing bodies, invalid JSON and content types, invalid title/description/status values, extra
authoritative fields, malformed or missing identifiers, repeated update/delete operations,
database unavailability or initialization failure, duplicate identifiers, unsupported filters,
special SQL characters, excessive query lengths, missing or invalid authentication, timeouts,
unknown routes, unsupported methods, unexpected non-Error throws, sensitive internal errors, and
concurrent update/delete requests.

---

# Non-Goals

Unless explicitly selected as an optional enhancement, the backend MUST NOT introduce user
registration, password storage, OAuth, refresh tokens, RBAC, WebSockets, event-driven services,
message queues, distributed transactions, Redis, Docker or Kubernetes orchestration, GraphQL,
event sourcing, CQRS frameworks, multiple deployable services, full observability platforms,
complex ORM abstractions, or cloud-specific infrastructure. A simple header token is sufficient.

---

# Implementation Priorities

Development MUST prioritize: TypeScript configuration; environment validation; domain types;
repository contract; SQLite repository; service; runtime validation; controllers and routes;
centralized errors; CRUD; search and filtering; security and CORS; authentication; Swagger;
automated tests; README; and final linting, formatting, and cleanup. Mandatory behavior MUST be
complete before optional refinements.

---

# Definition of Done

A backend feature is complete only when it complies with this constitution, uses strict typing,
validates external input, uses correct HTTP semantics and response formats, accesses data through
a repository, hides infrastructure details, handles expected and unexpected errors, documents
external behavior, preserves relevant tests and domain invariants, contains no debug code or
hardcoded secrets, keeps controllers thin, and updates README when setup or behavior changes.

---

# Quality Gates

Before delivery, the project MUST compile with no TypeScript errors, pass linting, formatting,
and automated tests, expose all required endpoints with their specified statuses, validate title,
description, status, identifiers, and filters, persist SQLite data across restarts, use bound SQL
parameters, support configurable authentication and CORS, expose Swagger, ignore `.env` and
database artifacts appropriately, keep SQLite out of controllers and Express out of services,
hide secrets and stacks, verify README instructions, and start and shut down without uncaught
errors.

---

# Governance

This constitution is the highest-priority engineering reference for the Task Management backend.
All specifications, implementation plans, task lists, reviews, and code changes MUST comply with
it. Conflicts MUST be identified, their impact documented, and a constitution-compliant
alternative preferred. Exceptions MUST be explicit, technically justified, minimal, and local.

Changes MUST preserve mandatory assessment requirements, include rationale, avoid weakening
validation, error handling, typing, testing, security, persistence, or documentation, remain
proportional to project scope, and update affected specifications and plans.

Versioning follows semantic versioning: MAJOR for incompatible governance or principle removals or
redefinitions, MINOR for new principles or materially expanded guidance, and PATCH for clarifying
or non-semantic wording changes. Every amendment MUST update the version and last-amended date.

Every feature review MUST verify the Definition of Done and Quality Gates. Reviewers MUST record
any exception and its rationale. Compliance MUST be checked before delivery and whenever a
specification, plan, or implementation changes an architectural or public API contract.

**Version**: 1.0.0 | **Ratified**: 2026-07-30 | **Last Amended**: 2026-07-30
