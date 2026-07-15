import { Injectable } from '@nestjs/common';

@Injectable()
export class FinalIntegrationValidationEngineService {
  validate(input: {
    marketplaceFlow: boolean;
    paymentFlow: boolean;
    serviceFlow: boolean;
    auctionExportFlow: boolean;
    crmFlow: boolean;
    aiOperationsFlow: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      passed: score === 100,
    };
  }
}