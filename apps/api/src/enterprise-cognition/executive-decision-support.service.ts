import { Injectable } from '@nestjs/common';
import {
  ConfidenceBand,
  ExecutiveDecisionBrief,
} from './enterprise-cognition.types';

@Injectable()
export class ExecutiveDecisionSupportService {
  createBrief(
    objective: string,
    options: string[],
    confidence: number,
    rationale: string[],
  ): ExecutiveDecisionBrief {
    const normalized = Math.max(0, Math.min(1, confidence));
    const confidenceBand: ConfidenceBand =
      normalized >= 0.9
        ? 'very-high'
        : normalized >= 0.75
          ? 'high'
          : normalized >= 0.55
            ? 'medium'
            : 'low';

    return {
      generatedAt: new Date().toISOString(),
      decision: options[0] ?? `Proceed with ${objective}`,
      confidence: normalized,
      confidenceBand,
      rationale,
      risks: [
        'model uncertainty',
        'data freshness',
        'execution dependency',
      ],
      recommendedActions: options.slice(0, 3),
    };
  }
}