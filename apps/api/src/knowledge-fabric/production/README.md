# AVOS Knowledge Fabric KF-6 Production Integration

Production runtime that unifies KF-1 through KF-5 inside AVOS Enterprise.

## Endpoints

- `POST /avos/knowledge-fabric/production/runtime/start`
- `POST /avos/knowledge-fabric/production/runtime/stop`
- `GET /avos/knowledge-fabric/production/runtime/status`
- `GET /avos/knowledge-fabric/production/health`
- `GET /avos/knowledge-fabric/production/metrics`
- `GET /avos/knowledge-fabric/production/registry`
- `POST /avos/knowledge-fabric/production/search`
- `POST /avos/knowledge-fabric/production/verification/run`
- `POST /avos/knowledge-fabric/production/smoke/run`
- `POST /avos/knowledge-fabric/production/certification/certify`
- `GET /avos/knowledge-fabric/production/certification/status`

## Search example

```json
{
  "query": "knowledge fabric runtime",
  "limit": 10
}
```