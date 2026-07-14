import { Injectable } from '@nestjs/common';
import {
  ContinuityPolicy,
  CrisisIncident,
  CriticalDependency,
  OperationalRisk,
  ResilienceSignal,
} from './enterprise-resilience-continuity.types';
import { EnterpriseResilienceEngineService } from './enterprise-resilience-engine.service';
import { OperationalRiskIntelligenceService } from './operational-risk-intelligence.service';
import { CriticalDependencyMapperService } from './critical-dependency-mapper.service';
import { FailurePredictionEngineService } from './failure-prediction-engine.service';
import { ContinuityPolicyEngineService } from './continuity-policy-engine.service';
import { BusinessContinuityOrchestratorService } from './business-continuity-orchestrator.service';
import { AutonomousCrisisResponseService } from './autonomous-crisis-response.service';
import { ExecutiveCrisisCommandCenterService } from './executive-crisis-command-center.service';

@Injectable()
export class EnterpriseResilienceContinuityOrchestratorService {
  constructor(
    private readonly resilience: EnterpriseResilienceEngineService,
    private readonly risk: OperationalRiskIntelligenceService,
    private readonly dependencies: CriticalDependencyMapperService,
    private readonly failure: FailurePredictionEngineService,
    private readonly policy: ContinuityPolicyEngineService,
    private readonly continuity: BusinessContinuityOrchestratorService,
    private readonly crisis: AutonomousCrisisResponseService,
    private readonly commandCenter: ExecutiveCrisisCommandCenterService,
  ) {}

  run(input: {
    signals: ResilienceSignal[];
    risks: OperationalRisk[];
    dependencies: CriticalDependency[];
    policies: ContinuityPolicy[];
    incident: CrisisIncident;
  }) {
    const resilience = this.resilience.evaluate(input.signals);
    const risk = this.risk.assess(input.risks);
    const dependencies = this.dependencies.map(input.dependencies);
    const failure = this.failure.predict(input.signals);
    const policy = this.policy.evaluate(
      input.dependencies,
      input.policies,
    );
    const recoveryPlan = this.continuity.createPlan(
      input.incident,
      input.dependencies,
    );
    const response = this.crisis.respond(
      input.incident,
      recoveryPlan,
    );
    const registeredIncident = this.commandCenter.register({
      ...input.incident,
      status: response.nextStatus,
    });

    return {
      resilience,
      risk,
      dependencies,
      failure,
      policy,
      recoveryPlan,
      response,
      registeredIncident,
      commandCenter: this.commandCenter.summary(),
    };
  }
}