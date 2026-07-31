# Data Model: Task Management API

## Task

Represents one unit of work persisted by the backend.

| Field | Type | Required | Rules | Source |
|---|---|---:|---|---|
| `id` | UUID string | Yes | Unique, immutable, backend-generated | Domain/service |
| `title` | string | Yes | Trimmed; 1-100 meaningful characters | Validated request |
| `description` | string or null | No | Maximum 500 characters; empty input normalizes to `null` | Validated request |
| `status` | `pending` \| `in_progress` \| `done` | Yes | Must be one of the supported statuses | Validated request |
| `createdAt` | UTC timestamp | Yes | Backend-generated; immutable after creation | Domain/service |
| `updatedAt` | UTC timestamp | Yes | Backend-generated; changes after successful update | Domain/service |

## Task Query

| Field | Type | Required | Rules |
|---|---|---:|---|
| `search` | string | No | Trimmed, bounded, case-insensitive match over title and description |
| `status` | Task status | No | Only supported statuses are accepted |

An omitted query returns all tasks. A blank search behaves like an omitted search. Search and
status filters may be combined. Invalid query values return the documented validation error.

## Request DTOs

### CreateTask

Required fields are `title` and `status`; `description` is optional. The client cannot supply
`id`, `createdAt`, or `updatedAt`.

### UpdateTask

PUT requires the complete editable representation: `title` and `status`, with optional
`description`. Generated fields are rejected or ignored consistently according to the validation
contract; they never override persisted values.

## State Transitions

```text
absent --create--> pending | in_progress | done
pending | in_progress | done --update--> pending | in_progress | done
pending | in_progress | done --delete--> absent
```

An update or delete for an absent task returns `TASK_NOT_FOUND` and does not create or mutate data.

## Persistence Mapping

The SQLite table `tasks` maps camelCase domain fields to snake_case columns:

```text
id TEXT PRIMARY KEY
title TEXT NOT NULL
description TEXT NULL
status TEXT NOT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

The repository MUST enforce the same length and enum invariants as the request boundary, use
parameterized statements, and convert stored timestamps to the domain representation.