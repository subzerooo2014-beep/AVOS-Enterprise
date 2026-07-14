# AVOS Provider Integration Readiness

## Required before onboarding a real provider

1. Partner legal and technical contact information.
2. Sandbox API base URL.
3. Authentication method:
   - API Key
   - OAuth2
   - Mutual TLS
4. Webhook callback contract.
5. Webhook signing secret.
6. Idempotency header contract.
7. Retry and timeout policy.
8. Rate limits.
9. Error code mapping.
10. Production approval and credential rotation process.

## Supported provider categories

- Finance
- Insurance
- Vehicle inspection
- Payment
- Shipping
- Export

## AVOS integration requirements

- Correlation ID on every request.
- Idempotency key on every mutating operation.
- Audit entry for request, response, retry, and failure.
- Dead-letter handling after maximum retries.
- No raw secrets in logs or API responses.
- Sandbox validation before production activation.
