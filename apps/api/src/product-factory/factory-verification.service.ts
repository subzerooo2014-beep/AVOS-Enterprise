import { Injectable } from '@nestjs/common';
import { FactoryBuild } from './product-factory.types';

@Injectable()
export class FactoryVerificationService {
  run(build: FactoryBuild) {
    const integration = build.integrationSnapshot;
    const checks = [
      { name: 'Foundation First', passed: build.governance.foundationFirst },
      { name: 'Capability First', passed: build.governance.capabilityFirst },
      { name: 'Blueprint Driven', passed: build.governance.blueprintDriven },
      { name: 'Human Final Authority', passed: build.governance.humanFinalAuthority },
      { name: 'Global Compliance Readiness Gate', passed: build.governance.globalComplianceReadinessGate },
      { name: 'Blueprint Generated', passed: Boolean(build.blueprint) },
      { name: 'Artifacts Generated', passed: build.artifacts.length > 0 },
      { name: 'Capability Fabric Connected', passed: integration?.capabilityFabric['status'] === 'connected' },
      { name: 'Knowledge Fabric Connected', passed: integration?.knowledgeFabric['status'] === 'connected' },
      { name: 'Intelligence Fabric Connected', passed: integration?.intelligenceFabric['status'] === 'connected' },
      { name: 'Marketplace Connected', passed: integration?.marketplace['status'] === 'connected' },
      { name: 'Product Templates Connected', passed: integration?.productTemplates['status'] === 'connected' },
      { name: 'Enterprise Kernel Connected', passed: integration?.enterpriseKernel['status'] === 'connected' },
      { name: 'No Build Errors', passed: build.errors.length === 0 },
    ];

    const passed = checks.filter((check) => check.passed).length;
    return {
      id: `product-factory-verification:${Date.now()}`,
      status: passed === checks.length ? 'passed' : 'failed',
      score: Math.round((passed / checks.length) * 100),
      checks,
      verifiedAt: new Date().toISOString(),
    };
  }
}