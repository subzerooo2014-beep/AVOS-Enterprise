import { Injectable } from '@nestjs/common';
import { FactoryBuild } from './product-factory.types';

@Injectable()
export class FactoryCertificationService {
  certify(build: FactoryBuild) {
    const verificationPassed = build.verification?.['status'] === 'passed';
    const smokePassed = build.smoke?.['status'] === 'passed';
    const productionReady =
      verificationPassed &&
      smokePassed &&
      build.artifacts.length > 0 &&
      build.governance.globalComplianceReadinessGate;

    return {
      id: `product-factory-certification:${Date.now()}`,
      status: productionReady ? 'certified' : 'rejected',
      score: productionReady ? 100 : 0,
      approvedBy: build.governance.approvedBy,
      foundationFirst: build.governance.foundationFirst,
      capabilityFirst: build.governance.capabilityFirst,
      blueprintDriven: build.governance.blueprintDriven,
      humanFinalAuthority: build.governance.humanFinalAuthority,
      globalComplianceReadinessGate: build.governance.globalComplianceReadinessGate,
      generatedArtifacts: build.artifacts.length,
      productionReady,
      certifiedAt: new Date().toISOString(),
    };
  }
}