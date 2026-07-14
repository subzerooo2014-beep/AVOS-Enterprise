import { Injectable } from '@nestjs/common';
import {
  EcosystemPartner,
  PartnerLifecycleAction,
} from './global-ecosystem-intelligence.types';

@Injectable()
export class AutonomousPartnerLifecycleManagerService {
  plan(partners: EcosystemPartner[]): PartnerLifecycleAction[] {
    return partners.map((partner) => {
      if (partner.status === 'prospect') {
        return {
          partnerId: partner.id,
          action: 'start-onboarding',
          reason: 'qualified prospect',
          priority: 70,
        };
      }

      if (
        partner.trustScore < 60 ||
        partner.performanceScore < 55 ||
        partner.integrationScore < 50
      ) {
        return {
          partnerId: partner.id,
          action: 'risk-remediation',
          reason: 'partner health below threshold',
          priority: 95,
        };
      }

      return {
        partnerId: partner.id,
        action: 'optimize-growth',
        reason: 'healthy active partner',
        priority: 60,
      };
    });
  }
}