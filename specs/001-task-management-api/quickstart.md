# Quickstart Validation: Task Management API

## Prerequisites

- Node.js 22 LTS or newer.
- npm.
- A terminal in the repository root.

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Set `AUTH_ENABLED=false` for the first smoke test. Use a temporary SQLite path for local data.

## Build and test

```powershell
npm run build
npm test
```

Expected result: TypeScript compilation succeeds and all unit, repository, and HTTP integration
tests pass without opening a real listening port.

## Run the service

```powershell
npm run dev
```

The default base URL is `http://localhost:3000/api`.

## CRUD smoke test

Create a task:

```powershell
$body = @{ title = 'Prepare README'; description = 'Document setup'; status = 'pending' } | ConvertTo-Json
$created = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType 'application/json' -Body $body
$created.data.id
```

Verify the following outcomes:

1. `GET /api/tasks` returns `200` with `success: true`, an array, and `meta.total`.
2. `GET /api/tasks/{id}` returns the created task with ISO timestamps.
3. `PUT /api/tasks/{id}` returns `200`, preserves `id` and `createdAt`, and changes `updatedAt`.
4. `GET /api/tasks?search=readme&status=pending` returns the matching task.
5. `DELETE /api/tasks/{id}` returns `204` with no body.
6. A second `GET /api/tasks/{id}` returns a safe `404` error envelope.

## Validation and security checks

- Send a missing title, whitespace-only title, invalid status, or oversized description and expect
  `400` with a stable error code and field details.
- Send a malformed identifier and expect `400`; send a valid but missing UUID and expect `404`.
- Set `AUTH_ENABLED=true` and a placeholder `API_TOKEN`; requests without or with the wrong bearer
  token must return `401`, while the configured token must allow the request.
- Send search terms containing quotes, `%`, `_`, and SQL-like characters; the service must not
  error or alter stored data.
- Open `GET /api/docs` and confirm the five endpoints, schemas, filters, responses, and bearer
  authentication are documented.

## Persistence check

1. Create a task.
2. Stop and restart the service.
3. Request the task by its identifier.

The task, identifier, content, and `createdAt` must remain unchanged. Tests must use an isolated
database path and must never depend on this local development file.

See [data-model.md](./data-model.md) for field invariants and
[contracts/openapi.yaml](./contracts/openapi.yaml) for the public API contract.