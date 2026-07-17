# AVOS Intelligence Fabric IF-2

Unified Intelligence Orchestrator for coordinating AVOS intelligence engines.

## Capabilities

- Unified intelligence engine registry
- Domain and capability routing
- Multi-engine execution
- Confidence aggregation
- Conflict detection
- Unified decision generation
- Knowledge Fabric integration
- Capability Fabric integration
- Event-driven orchestration
- Metrics and observability
- Health monitoring
- Verification
- Smoke testing
- Production certification

## Endpoints

- `GET /avos/intelligence-fabric/orchestration/registry`
- `PATCH /avos/intelligence-fabric/orchestration/registry/:id/health`
- `GET /avos/intelligence-fabric/orchestration/health`
- `GET /avos/intelligence-fabric/orchestration/metrics`
- `GET /avos/intelligence-fabric/orchestration/events`
- `POST /avos/intelligence-fabric/orchestration/execute`
- `POST /avos/intelligence-fabric/orchestration/verification/run`
- `POST /avos/intelligence-fabric/orchestration/smoke/run`
- `POST /avos/intelligence-fabric/orchestration/certification/certify`
- `GET /avos/intelligence-fabric/orchestration/certification/status`