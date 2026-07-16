# AVOS Capability Fabric — Mega Pack CF-2

## Architectural role

CF-2 creates the governed runtime layer that loads, resolves, activates,
isolates, monitors, suspends, restarts, and stops capabilities registered by CF-1.

## Included runtime foundations

1. Runtime context
2. Registry-based capability resolution
3. Required dependency resolution
4. Dependency-cycle blocking
5. Lazy loading
6. Runtime activation
7. Runtime suspension
8. Runtime restart
9. Runtime stop
10. Runtime isolation descriptors
11. Resource policies
12. Runtime cache
13. Runtime health
14. Runtime diagnostics
15. Execution and performance tracking

## Foundation-first guarantees

- CF-1 is a mandatory prerequisite.
- No CF-1 source file is overwritten.
- Runtime consumes the exported Capability Registry contract.
- Existing Foundation, Kernel, Brain, and Nervous System remain untouched.
- Installation requires a clean Git working tree.
- Type Check, Build, Verification, Smoke Test, and Rollback are included.

## API

Base route: `/capability-fabric/runtime`

- `GET /status`
- `POST /instances`
- `GET /instances`
- `GET /instances/:runtimeId`
- `POST /instances/:runtimeId/activate`
- `POST /instances/:runtimeId/suspend`
- `POST /instances/:runtimeId/restart`
- `POST /instances/:runtimeId/stop`
- `GET /instances/:runtimeId/health`
- `GET /instances/:runtimeId/diagnostics`
- `POST /execute`
- `POST /instances/:runtimeId/cache/:key`
- `GET /instances/:runtimeId/cache/:key`
- `GET /snapshot`
- `POST /smoke`

## Next official stage

Mega Pack CF-3 — Capability Orchestration.