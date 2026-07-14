import { Module } from "@nestjs/common";
import { ProductionIntegrationsController } from "./production-integrations.controller";
import { ProviderRegistryService } from "./core/provider-registry.service";
import { ExecutionContextService } from "./core/execution-context.service";
import { ProviderExecutorService } from "./core/provider-executor.service";
import { OAuth2TokenService } from "./security/oauth2-token.service";
import { ApiKeyVaultService } from "./security/api-key-vault.service";
import { RequestSigningService } from "./security/request-signing.service";
import { WebhookSecurityService } from "./security/webhook-security.service";
import { CircuitBreakerService } from "./reliability/circuit-breaker.service";
import { RateLimiterService } from "./reliability/rate-limiter.service";
import { RetryPolicyService } from "./reliability/retry-policy.service";
import { TimeoutPolicyService } from "./reliability/timeout-policy.service";
import { FailoverRouterService } from "./reliability/failover-router.service";
import { ProviderMetricsService } from "./monitoring/provider-metrics.service";
import { SlaMonitorService } from "./monitoring/sla-monitor.service";
import { MockProviderService } from "./testing/mock-provider.service";
import { SandboxSimulatorService } from "./testing/sandbox-simulator.service";
import { BankProvider } from "./providers/bank.provider";
import { PaymentProvider } from "./providers/payment.provider";
import { InsuranceProvider } from "./providers/insurance.provider";
import { InspectionProvider } from "./providers/inspection.provider";
import { GovernmentProvider } from "./providers/government.provider";
import { ShippingProvider } from "./providers/shipping.provider";
import { ExportProvider } from "./providers/export.provider";

@Module({
  controllers: [ProductionIntegrationsController],
  providers: [
    ProviderRegistryService,
    ExecutionContextService,
    ProviderExecutorService,
    OAuth2TokenService,
    ApiKeyVaultService,
    RequestSigningService,
    WebhookSecurityService,
    CircuitBreakerService,
    RateLimiterService,
    RetryPolicyService,
    TimeoutPolicyService,
    FailoverRouterService,
    ProviderMetricsService,
    SlaMonitorService,
    MockProviderService,
    SandboxSimulatorService,
    BankProvider,
    PaymentProvider,
    InsuranceProvider,
    InspectionProvider,
    GovernmentProvider,
    ShippingProvider,
    ExportProvider,
  ],
  exports: [ProviderExecutorService, ProviderRegistryService, SlaMonitorService],
})
export class ProductionIntegrationsModule {}
