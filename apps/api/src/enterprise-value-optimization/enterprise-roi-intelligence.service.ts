import { Injectable } from '@nestjs/common';

@Injectable()
export class EnterpriseRoiIntelligenceService {
  calculate(investment: number, returnValue: number) {
    const roiPercent =
      investment === 0
        ? 0
        : ((returnValue - investment) / investment) * 100;

    return {
      investment,
      returnValue,
      netReturn: returnValue - investment,
      roiPercent: Number(roiPercent.toFixed(2)),
      roiScore: Math.max(
        0,
        Math.min(100, Math.round(50 + roiPercent / 2)),
      ),
    };
  }
}