import { BadRequestException, Injectable } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  ProductionCertificationRequest,
  ProductionCertificationResult,
} from './production-deployment-go-live.types';
import { ProductionReadinessVerificationService } from './production-readiness-verification.service';

@Injectable()
export class ProductionGoLiveCertificationService {
  private readonly evidenceRoot = join(
    resolve(process.cwd(), '..', '..'),
    '.avos',
    'evidence',
    'production-deployment-go-live',
  );

  constructor(
    private readonly verification: ProductionReadinessVerificationService,
  ) {
    mkdirSync(this.evidenceRoot, { recursive: true });
  }

  certify(
    request: ProductionCertificationRequest,
  ): ProductionCertificationResult {
    const approvedBy = request?.approvedBy?.trim();

    if (!approvedBy) {
      throw new BadRequestException(
        'approvedBy is required by Human Final Authority.',
      );
    }

    const verification = this.verification.verify() as {
      status: string;
      score: number;
      checks: Record<string, boolean>;
      runtime: {
        unresolvedErrors: number;
        unjustifiedWarnings: number;
      };
    };

    const passed = verification.status === 'passed';
    const timestamp = Date.now();
    const evidencePath = join(
      this.evidenceRoot,
      `production-go-live-certification-${timestamp}.json`,
    );

    const result: ProductionCertificationResult = {
      id: `production-go-live-certification-${timestamp}`,
      name: 'AVOS Production Deployment & Go-Live — Unified Mega Pack 1',
      version: 'PDGL-UMP1-1.0.0',
      status: passed ? 'certified' : 'blocked',
      score: verification.score,
      approvedBy,
      deploymentTarget:
        request.deploymentTarget?.trim() || 'production',
      unresolvedErrors: verification.runtime.unresolvedErrors,
      unjustifiedWarnings: verification.runtime.unjustifiedWarnings,
      checks: {
        ...verification.checks,
        productionReady: passed,
        goLiveReady: passed,
      },
      certifiedAt: new Date().toISOString(),
      evidencePath,
    };

    writeFileSync(
      evidencePath,
      JSON.stringify({ result, verification }, null, 2),
      'utf8',
    );

    return result;
  }
}
