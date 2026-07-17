# AVOS Knowledge Fabric — KF-1 Knowledge Foundation

KF-1 introduces the first production foundation of AVOS Knowledge Fabric.

## Included foundations

- Knowledge Registry
- Knowledge DNA
- Knowledge Metadata
- Knowledge Graph Foundation
- Knowledge Contracts
- Knowledge Classification
- Knowledge Versioning
- Knowledge Dependencies
- Knowledge Provenance
- Knowledge Checksum
- Knowledge Lifecycle
- Knowledge Trust Foundation

## Runtime endpoints

- `GET /knowledge-fabric/status`
- `GET /knowledge-fabric/health`
- `GET /knowledge-fabric/knowledge`
- `GET /knowledge-fabric/knowledge/:id`
- `POST /knowledge-fabric/knowledge`
- `PATCH /knowledge-fabric/knowledge/:id`
- `POST /knowledge-fabric/knowledge/:id/activate`
- `POST /knowledge-fabric/knowledge/:id/deprecate`
- `POST /knowledge-fabric/knowledge/:id/archive`
- `POST /knowledge-fabric/relations`
- `GET /knowledge-fabric/knowledge/:id/dependencies`
- `GET /knowledge-fabric/knowledge/:id/dependents`

## Architectural rule

Foundation First remains mandatory. Higher Knowledge Fabric layers must consume
the canonical contracts and lifecycle introduced by KF-1 rather than duplicating them.