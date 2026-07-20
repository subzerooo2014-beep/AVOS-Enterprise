import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductionIntelligenceService {
  recommend(reasons: string[]): {
    priority: 'none' | 'medium' | 'high';
    recommendations: string[];
  } {
    if (reasons.length === 0) {
      return {
        priority: 'none',
        recommendations: ['Maintain continuous monitoring and scheduled recertification.'],
      };
    }

    return {
      priority: reasons.length >= 3 ? 'high' : 'medium',
      recommendations: reasons.map(
        (reason) => 'Resolve certification blocker: ' + reason,
      ),
    };
  }
}
