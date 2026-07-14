import { Module } from "@nestjs/common";
import { GovernmentPlatformController } from "./government-platform.controller";
import { GovernmentPlatformService } from "./government-platform.service";

import { IdentityConsentPolicy } from "./policies/identity-consent.policy";
import { EmiratesIdPolicy } from "./policies/emirates-id.policy";
import { VehicleLookupPolicy } from "./policies/vehicle-lookup.policy";
import { OwnershipTransferPolicy } from "./policies/ownership-transfer.policy";
import { CustomsExportPolicy } from "./policies/customs-export.policy";
import { GovernmentWebhookPolicy } from "./policies/government-webhook.policy";
import { GovernmentProviderPolicy } from "./policies/government-provider.policy";
import { GovernmentCompliancePolicy } from "./policies/government-compliance.policy";

import { GovernmentRequestSigningService } from "./security/government-request-signing.service";
import { GovernmentOAuthService } from "./security/government-oauth.service";
import { GovernmentSecretVaultService } from "./security/government-secret-vault.service";
import { GovernmentWebhookSecurityService } from "./security/government-webhook-security.service";

import { GovernmentConsentService } from "./compliance/government-consent.service";
import { GovernmentEvidenceService } from "./compliance/government-evidence.service";
import { GovernmentComplianceService } from "./compliance/government-compliance.service";

import { UaePassProvider } from "./providers/uae-pass.provider";
import { EmiratesIdProvider } from "./providers/emirates-id.provider";
import { RtaProvider } from "./providers/rta.provider";
import { MoiProvider } from "./providers/moi.provider";
import { SalikProvider } from "./providers/salik.provider";
import { EvgProvider } from "./providers/evg.provider";
import { CustomsProvider } from "./providers/customs.provider";
import { OwnershipTransferProvider } from "./providers/ownership-transfer.provider";

import { GovernmentProviderRegistryService } from "./services/government-provider-registry.service";
import { GovernmentContextService } from "./services/government-context.service";
import { GovernmentAuditService } from "./services/government-audit.service";
import { GovernmentWebhookService } from "./services/government-webhook.service";
import { GovernmentNotificationService } from "./services/government-notification.service";
import { GovernmentReportingService } from "./services/government-reporting.service";
import { GovernmentDashboardService } from "./services/government-dashboard.service";
import { GovernmentHealthService } from "./services/government-health.service";
import { GovernmentRateLimitService } from "./services/government-rate-limit.service";
import { GovernmentRetryService } from "./services/government-retry.service";
import { GovernmentTimeoutService } from "./services/government-timeout.service";
import { GovernmentCaseService } from "./services/government-case.service";

@Module({
  controllers: [GovernmentPlatformController],
  providers: [
    GovernmentPlatformService,

    IdentityConsentPolicy,
    EmiratesIdPolicy,
    VehicleLookupPolicy,
    OwnershipTransferPolicy,
    CustomsExportPolicy,
    GovernmentWebhookPolicy,
    GovernmentProviderPolicy,
    GovernmentCompliancePolicy,

    GovernmentRequestSigningService,
    GovernmentOAuthService,
    GovernmentSecretVaultService,
    GovernmentWebhookSecurityService,

    GovernmentConsentService,
    GovernmentEvidenceService,
    GovernmentComplianceService,

    UaePassProvider,
    EmiratesIdProvider,
    RtaProvider,
    MoiProvider,
    SalikProvider,
    EvgProvider,
    CustomsProvider,
    OwnershipTransferProvider,

    GovernmentProviderRegistryService,
    GovernmentContextService,
    GovernmentAuditService,
    GovernmentWebhookService,
    GovernmentNotificationService,
    GovernmentReportingService,
    GovernmentDashboardService,
    GovernmentHealthService,
    GovernmentRateLimitService,
    GovernmentRetryService,
    GovernmentTimeoutService,
    GovernmentCaseService,
  ],
  exports: [
    GovernmentPlatformService,
    GovernmentConsentService,
    GovernmentEvidenceService,
    GovernmentComplianceService,
  ],
})
export class GovernmentPlatformModule {}
