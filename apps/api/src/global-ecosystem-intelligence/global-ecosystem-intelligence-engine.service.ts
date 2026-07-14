import { Injectable } from '@nestjs/common';
import {
  EcosystemPartner,
  ExternalSignal,
} from './global-ecosystem-intelligence.types';

@Injectable()
export class GlobalEcosystemIntelligenceEngineService {
  analyze(partners: EcosystemPartner[], signals: ExternalSignal[]) {
    const partnerHealth =
      partners.reduce(
        (sum, partner) =>
          sum +
          partner.trustScore * 0.35 +
          partner.performanceScore * 0.35 +
          partner.integrationScore * 0.3,
        0,
      ) / Math.max(1, partners.length);

    const signalStrength =
      signals.reduce(
        (sum, signal) => sum + signal.value * signal.confidence,
        0,
      ) /
      Math.max(
        1,
        signals.reduce((sum, signal) => sum + signal.confidence, 0),
      );

    return {
      ecosystemHealth: Math.round(
        Math.max(0, Math.min(100, partnerHealth * 0.7 + signalStrength * 0.3)),
      ),
      activePartners: partners.filter((partner) => partner.status === 'active')
        .length,
      atRiskPartners: partners.filter((partner) => partner.status === 'at-risk')
        .map((partner) => partner.id),
      domains: [...new Set(signals.map((signal) => signal.domain))],
      regions: [...new Set(partners.map((partner) => partner.region))],
    };
  }
}