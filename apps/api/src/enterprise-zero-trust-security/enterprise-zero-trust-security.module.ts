import { Module } from '@nestjs/common';
import { EnterpriseZeroTrustSecurityController } from './enterprise-zero-trust-security.controller';
import { EnterpriseZeroTrustEngineService } from './enterprise-zero-trust-engine.service';
import { ContinuousIdentityVerificationService } from './continuous-identity-verification.service';
import { AdaptiveAccessPolicyEngineService } from './adaptive-access-policy-engine.service';
import { DeviceTrustIntelligenceService } from './device-trust-intelligence.service';
import { BehavioralThreatDetectionService } from './behavioral-threat-detection.service';
import { PrivilegedAccessGovernanceService } from './privileged-access-governance.service';
import { SecurityPostureIntelligenceService } from './security-posture-intelligence.service';
import { AutonomousIncidentResponseService } from './autonomous-incident-response.service';
import { SecretsKeyGovernanceService } from './secrets-key-governance.service';
import { IntegrationThreatProtectionService } from './integration-threat-protection.service';
import { SecurityEventCorrelationService } from './security-event-correlation.service';
import { EnterpriseSecurityCommandCenterService } from './enterprise-security-command-center.service';
import { EnterpriseZeroTrustSecurityOrchestratorService } from './enterprise-zero-trust-security-orchestrator.service';
import { ZeroTrustSecurityDashboardService } from './zero-trust-security-dashboard.service';

@Module({
  controllers: [EnterpriseZeroTrustSecurityController],
  providers: [
    EnterpriseZeroTrustEngineService,
    ContinuousIdentityVerificationService,
    AdaptiveAccessPolicyEngineService,
    DeviceTrustIntelligenceService,
    BehavioralThreatDetectionService,
    PrivilegedAccessGovernanceService,
    SecurityPostureIntelligenceService,
    AutonomousIncidentResponseService,
    SecretsKeyGovernanceService,
    IntegrationThreatProtectionService,
    SecurityEventCorrelationService,
    EnterpriseSecurityCommandCenterService,
    EnterpriseZeroTrustSecurityOrchestratorService,
    ZeroTrustSecurityDashboardService,
  ],
  exports: [
    EnterpriseZeroTrustEngineService,
    ContinuousIdentityVerificationService,
    AdaptiveAccessPolicyEngineService,
    DeviceTrustIntelligenceService,
    BehavioralThreatDetectionService,
    PrivilegedAccessGovernanceService,
    SecurityPostureIntelligenceService,
    AutonomousIncidentResponseService,
    SecretsKeyGovernanceService,
    IntegrationThreatProtectionService,
    SecurityEventCorrelationService,
    EnterpriseSecurityCommandCenterService,
    EnterpriseZeroTrustSecurityOrchestratorService,
    ZeroTrustSecurityDashboardService,
  ],
})
export class EnterpriseZeroTrustSecurityModule {}