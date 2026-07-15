import { Injectable } from '@nestjs/common';
import { ExportAssessment } from './auction-export-logistics.types';

@Injectable()
export class ExportEligibilityEngineService {
  assess(input: Omit<ExportAssessment, 'eligible' | 'reasons'>): ExportAssessment {
    const reasons: string[] = [];

    if (!input.titleClear) reasons.push('title-not-clear');
    if (!input.inspectionPassed) reasons.push('inspection-required');
    if (!input.sanctionsCleared) reasons.push('sanctions-check-failed');
    if (input.vehicleAge > 30) reasons.push('destination-age-limit-review');

    return {
      ...input,
      eligible: reasons.length === 0,
      reasons,
    };
  }
}