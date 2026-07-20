# AVOS Production & Certification Platform

Shared AVOS production-readiness, real-evidence, certification, deployment-gate,
continuous-monitoring, audit, and production-intelligence platform.

## Architectural rule

Other AVOS domains must integrate through exported application services, REST
contracts, or future event adapters. They must not import infrastructure adapters
or repository implementations directly.

## Separation readiness

The domain, application, ports, infrastructure, DTO, and API boundaries are
structured so this module can later move to an independent NestJS application or
repository without rewriting its core certification logic.
