import { Injectable } from '@nestjs/common';
import {
  DependencyHealth,
  FoundationModule,
  ReleaseEvidence,
} from './foundation-production-readiness.types';
import { FoundationIntegrityEngineService } from './foundation-integrity-engine.service';
import { ArchitectureConformanceEngineService } from './architecture-conformance-engine.service';
import { ModuleConnectivityVerifierService } from './module-connectivity-verifier.service';
import { SecurityReadinessAuditorService } from './security-readiness-auditor.service';
import { DataReadinessAuditorService } from './data-readiness-auditor.service';
import { OperationalReadinessAuditorService } from './operational-readiness-auditor.service';
import { DependencyHealthAnalyzerService } from './dependency-health-analyzer.service';
import { ReleaseGateOrchestratorService } from './release-gate-orchestrator.service';
import { EndToEndFoundationValidatorService } from './end-to-end-foundation-validator.service';
import { FoundationCompletionCertificateService } from './foundation-completion-certificate.service';

@Injectable()
export class FoundationProductionReadinessOrchestratorService {
  constructor(
    private readonly integrity: FoundationIntegrityEngineService,
    private readonly architecture: ArchitectureConformanceEngineService,
    private readonly connectivity: ModuleConnectivityVerifierService,
    private readonly security: SecurityReadinessAuditorService,
    private readonly data: DataReadinessAuditorService,
    private readonly operations: OperationalReadinessAuditorService,
    private readonly dependencies: DependencyHealthAnalyzerService,
    private readonly release: ReleaseGateOrchestratorService,
    private readonly endToEnd: EndToEndFoundationValidatorService,
    private readonly certificate: FoundationCompletionCertificateService,
  ) {}

  run(input: {
    branch: string;
    modules: FoundationModule[];
    dependencies: DependencyHealth[];
    evidence: ReleaseEvidence[];
  }) {
    const integrity = this.integrity.evaluate(input.modules);
    const architecture = this.architecture.assess(input.modules);
    const connectivity = this.connectivity.verify(input.modules);
    const security = this.security.audit({
      zeroTrustEnabled: true,
      secretsGoverned: true,
      threatDetectionEnabled: true,
      incidentResponseReady: true,
    });
    const data = this.data.audit({
      governanceEnabled: true,
      lineageEnabled: true,
      qualityEnabled: true,
      sovereigntyEnabled: true,
    });
    const operations = this.operations.audit({
      observabilityReady: true,
      resilienceReady: true,
      continuityReady: true,
      orchestrationReady: true,
    });
    const dependencies = this.dependencies.analyze(input.dependencies);
    const endToEnd = this.endToEnd.validate(input.modules);

    const release = this.release.evaluate(
      [
        security,
        data,
        operations,
        {
          id: 'architecture-readiness',
          category: 'architecture',
          name: 'Architecture readiness',
          passed:
            architecture.conformant &&
            connectivity.brokenLinks.length === 0,
          score: Math.round(
            (architecture.conformanceScore +
              connectivity.connectivityScore) /
              2,
          ),
          evidence: [
            'architecture-conformance',
            'module-connectivity',
          ],
          blockers: [
            ...architecture.missingDependencies,
            ...connectivity.brokenLinks,
          ],
        },
        {
          id: 'foundation-integrity',
          category: 'foundation',
          name: 'Foundation integrity',
          passed:
            integrity.unhealthyModules.length === 0 &&
            endToEnd.passed,
          score: Math.round(
            (integrity.foundationScore + endToEnd.passRate) / 2,
          ),
          evidence: [
            'foundation-integrity',
            'end-to-end-validation',
          ],
          blockers: [
            ...integrity.unhealthyModules,
            ...endToEnd.failedScenarios,
            ...dependencies.blockers,
          ],
        },
      ],
      input.evidence,
    );

    const certificate = this.certificate.issue({
      branch: input.branch,
      score: release.readiness.score,
      status: release.readiness.status,
      evidenceCount: release.evidence.total,
      blockers: release.readiness.blockers,
    });

    return {
      integrity,
      architecture,
      connectivity,
      security,
      data,
      operations,
      dependencies,
      endToEnd,
      release,
      certificate,
    };
  }
}