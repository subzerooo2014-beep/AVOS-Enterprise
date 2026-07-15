import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceQualitySlaEngineService {
  evaluate(input: {
    promisedMinutes: number;
    actualMinutes: number;
    qualityScore: number;
  }) {
    const onTime = input.actualMinutes <= input.promisedMinutes;
    const complianceScore = Math.round(
      (onTime ? 50 : 20) + input.qualityScore * 0.5,
    );

    return {
      ...input,
      onTime,
      complianceScore: Math.min(100, complianceScore),
      breached: !onTime || input.qualityScore < 70,
    };
  }
}