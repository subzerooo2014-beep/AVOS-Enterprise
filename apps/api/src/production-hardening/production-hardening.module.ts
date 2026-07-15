import { Module } from '@nestjs/common';
import { ProductionHardeningController } from './production-hardening.controller';
import { SecurityHardeningEngineService } from './security-hardening-engine.service';
import { AuthenticationHardeningEngineService } from './authentication-hardening-engine.service';
import { AuthorizationHardeningEngineService } from './authorization-hardening-engine.service';
import { SecretExposureAuditEngineService } from './secret-exposure-audit-engine.service';
import { InputValidationHardeningEngineService } from './input-validation-hardening-engine.service';
import { PerformanceProfilingEngineService } from './performance-profiling-engine.service';
import { ScalabilityReadinessEngineService } from './scalability-readiness-engine.service';
import { ReliabilityPolicyEngineService } from './reliability-policy-engine.service';
import { ResiliencePatternEngineService } from './resilience-pattern-engine.service';
import { DisasterRecoveryEngineService } from './disaster-recovery-engine.service';
import { BackupRestoreValidationEngineService } from './backup-restore-validation-engine.service';
import { ObservabilityReadinessEngineService } from './observability-readiness-engine.service';
import { IncidentResponseReadinessEngineService } from './incident-response-readiness-engine.service';
import { ProductionConfigurationAuditEngineService } from './production-configuration-audit-engine.service';
import { ProductionReadinessScoreEngineService } from './production-readiness-score-engine.service';
import { ProductionHardeningOrchestratorService } from './production-hardening-orchestrator.service';
import { ProductionHardeningDashboardService } from './production-hardening-dashboard.service';

@Module({
  controllers: [ProductionHardeningController],
  providers: [
    SecurityHardeningEngineService,
    AuthenticationHardeningEngineService,
    AuthorizationHardeningEngineService,
    SecretExposureAuditEngineService,
    InputValidationHardeningEngineService,
    PerformanceProfilingEngineService,
    ScalabilityReadinessEngineService,
    ReliabilityPolicyEngineService,
    ResiliencePatternEngineService,
    DisasterRecoveryEngineService,
    BackupRestoreValidationEngineService,
    ObservabilityReadinessEngineService,
    IncidentResponseReadinessEngineService,
    ProductionConfigurationAuditEngineService,
    ProductionReadinessScoreEngineService,
    ProductionHardeningOrchestratorService,
    ProductionHardeningDashboardService,
  ],
  exports: [
    SecurityHardeningEngineService,
    AuthenticationHardeningEngineService,
    AuthorizationHardeningEngineService,
    SecretExposureAuditEngineService,
    InputValidationHardeningEngineService,
    PerformanceProfilingEngineService,
    ScalabilityReadinessEngineService,
    ReliabilityPolicyEngineService,
    ResiliencePatternEngineService,
    DisasterRecoveryEngineService,
    BackupRestoreValidationEngineService,
    ObservabilityReadinessEngineService,
    IncidentResponseReadinessEngineService,
    ProductionConfigurationAuditEngineService,
    ProductionReadinessScoreEngineService,
    ProductionHardeningOrchestratorService,
    ProductionHardeningDashboardService,
  ],
})
export class ProductionHardeningModule {}