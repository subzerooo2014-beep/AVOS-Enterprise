import { Injectable } from '@nestjs/common';
import {
  ObservabilityControl,
  PerformanceMetric,
  ProductionConfiguration,
  RecoveryScenario,
  ReliabilityPolicy,
  SecurityControl,
} from './production-hardening.types';
import { SecurityHardeningEngineService } from './security-hardening-engine.service';
import { PerformanceProfilingEngineService } from './performance-profiling-engine.service';
import { ScalabilityReadinessEngineService } from './scalability-readiness-engine.service';
import { ReliabilityPolicyEngineService } from './reliability-policy-engine.service';
import { DisasterRecoveryEngineService } from './disaster-recovery-engine.service';
import { ObservabilityReadinessEngineService } from './observability-readiness-engine.service';
import { ProductionConfigurationAuditEngineService } from './production-configuration-audit-engine.service';
import { ProductionReadinessScoreEngineService } from './production-readiness-score-engine.service';

@Injectable()
export class ProductionHardeningOrchestratorService {
  constructor(
    private readonly security: SecurityHardeningEngineService,
    private readonly performance: PerformanceProfilingEngineService,
    private readonly scalability: ScalabilityReadinessEngineService,
    private readonly reliability: ReliabilityPolicyEngineService,
    private readonly recovery: DisasterRecoveryEngineService,
    private readonly observability: ObservabilityReadinessEngineService,
    private readonly configuration: ProductionConfigurationAuditEngineService,
    private readonly readiness: ProductionReadinessScoreEngineService,
  ) {}

  run(input: {
    securityControls: SecurityControl[];
    performanceMetrics: PerformanceMetric[];
    reliabilityPolicies: ReliabilityPolicy[];
    recoveryScenarios: RecoveryScenario[];
    observabilityControls: ObservabilityControl[];
    productionConfiguration: ProductionConfiguration;
  }) {
    const security = this.security.audit(input.securityControls);
    const performance = this.performance.analyze(
      input.performanceMetrics,
    );
    const scalability = this.scalability.evaluate({
      statelessApi: true,
      sharedSessionStore: true,
      horizontalScalingReady: true,
      connectionPoolConfigured: true,
      queuesScalable: true,
      loadBalancerReady: true,
      idempotencySupported: true,
    });
    const reliability = this.reliability.evaluate(
      input.reliabilityPolicies,
    );
    const recovery = this.recovery.evaluate(
      input.recoveryScenarios,
    );
    const observability = this.observability.evaluate(
      input.observabilityControls,
    );
    const configuration = this.configuration.audit(
      input.productionConfiguration,
    );

    const readiness = this.readiness.calculate({
      securityScore: security.score,
      performanceScore: performance.score,
      scalabilityScore: scalability.score,
      reliabilityScore: reliability.score,
      recoveryScore: recovery.score,
      observabilityScore: observability.score,
      configurationScore: configuration.score,
    });

    return {
      security,
      performance,
      scalability,
      reliability,
      recovery,
      observability,
      configuration,
      readiness,
    };
  }
}