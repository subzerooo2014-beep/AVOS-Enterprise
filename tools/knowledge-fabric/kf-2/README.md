# AVOS Knowledge Fabric — KF-2 Knowledge Runtime

Production runtime layer for resolving, retrieving, policy-filtering, caching, assembling, tracing, and measuring operational knowledge.

## Routes
- `GET /knowledge-fabric/runtime/status`
- `GET /knowledge-fabric/runtime/health`
- `GET /knowledge-fabric/runtime/metrics`
- `GET /knowledge-fabric/runtime/events`
- `GET /knowledge-fabric/runtime/sessions`
- `GET /knowledge-fabric/runtime/sessions/:id`
- `POST /knowledge-fabric/runtime/query`
- `POST /knowledge-fabric/runtime/execute`
- `POST /knowledge-fabric/runtime/cache/invalidate`