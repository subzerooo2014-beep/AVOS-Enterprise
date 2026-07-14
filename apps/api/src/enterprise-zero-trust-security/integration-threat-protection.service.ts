import { Injectable } from '@nestjs/common';

interface IntegrationThreatProfile {
  id: string;
  trustScore: number;
  errorRate: number;
  anomalyScore: number;
  securityScore: number;
}

@Injectable()
export class IntegrationThreatProtectionService {
  assess(profiles: IntegrationThreatProfile[]) {
    const evaluated = profiles.map((profile) => {
      const threatScore =
        (100 - profile.trustScore) * 0.3 +
        profile.errorRate * 0.2 +
        profile.anomalyScore * 0.3 +
        (100 - profile.securityScore) * 0.2;

      return {
        ...profile,
        threatScore: Math.round(threatScore),
        blocked: threatScore >= 60,
      };
    });

    return {
      integrations: evaluated,
      blockedIntegrations: evaluated
        .filter((profile) => profile.blocked)
        .map((profile) => profile.id),
    };
  }
}