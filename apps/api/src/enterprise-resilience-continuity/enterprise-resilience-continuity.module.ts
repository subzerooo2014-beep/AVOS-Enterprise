import { Module } from '@nestjs/common';
import { EnterpriseResilienceContinuityController } from './enterprise-resilience-continuity.controller';
import { EnterpriseResilienceEngineService } from './enterprise-resilience-engine.service';
import { OperationalRiskIntelligenceService } from './operational-risk-intelligence.service';
import { BusinessContinuityOrchestratorService } from './business-continuity-orchestrator.service';
import { AutonomousCrisisResponseService } from './autonomous-crisis-response.service';
import { FailurePredictionEngineService } from './failure-prediction-engine.service';
import { SelfHealingEnterpriseRuntimeService } from './self-healing-enterprise-runtime.service';
import { DisasterRecoveryIntelligenceService } from './disaster-recovery-intelligence.service';
import { CriticalDependencyMapperService } from './critical-dependency-mapper.service';
import { ContinuityPolicyEngineService } from './continuity-policy-engine.service';
import { ResilienceSimulationLaboratoryService } from './resilience-simulation-laboratory.service';
import { ExecutiveCrisisCommandCenterService } from './executive-crisis-command-center.service';
import { EnterpriseResilienceContinuityOrchestratorService } from './enterprise-resilience-continuity-orchestrator.service';
import { ResilienceContinuityDashboardService } from './resilience-continuity-dashboard.service';

@Module({
  controllers: [EnterpriseResilienceContinuityController],
  providers: [
    EnterpriseResilienceEngineService,
    OperationalRiskIntelligenceService,
    BusinessContinuityOrchestratorService,
    AutonomousCrisisResponseService,
    FailurePredictionEngineService,
    SelfHealingEnterpriseRuntimeService,
    DisasterRecoveryIntelligenceService,
    CriticalDependencyMapperService,
    ContinuityPolicyEngineService,
    ResilienceSimulationLaboratoryService,
    ExecutiveCrisisCommandCenterService,
    EnterpriseResilienceContinuityOrchestratorService,
    ResilienceContinuityDashboardService,
  ],
  exports: [
    EnterpriseResilienceEngineService,
    OperationalRiskIntelligenceService,
    BusinessContinuityOrchestratorService,
    AutonomousCrisisResponseService,
    FailurePredictionEngineService,
    SelfHealingEnterpriseRuntimeService,
    DisasterRecoveryIntelligenceService,
    CriticalDependencyMapperService,
    ContinuityPolicyEngineService,
    ResilienceSimulationLaboratoryService,
    ExecutiveCrisisCommandCenterService,
    EnterpriseResilienceContinuityOrchestratorService,
    ResilienceContinuityDashboardService,
  ],
})
export class EnterpriseResilienceContinuityModule {}