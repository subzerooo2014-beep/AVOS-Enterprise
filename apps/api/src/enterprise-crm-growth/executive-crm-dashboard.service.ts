import { Injectable } from '@nestjs/common';
import {
  CrmGrowthDashboardSnapshot,
  ENTERPRISE_CRM_GROWTH_CAPABILITIES,
} from './enterprise-crm-growth.types';

@Injectable()
export class ExecutiveCrmDashboardService {
  snapshot(
    input: Partial<CrmGrowthDashboardSnapshot> = {},
  ): CrmGrowthDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      activeCustomers: Math.max(
        0,
        Math.round(input.activeCustomers ?? 0),
      ),
      healthyCustomers: Math.max(
        0,
        Math.round(input.healthyCustomers ?? 0),
      ),
      qualifiedLeads: Math.max(
        0,
        Math.round(input.qualifiedLeads ?? 0),
      ),
      pipelineValue: Math.max(
        0,
        Number(input.pipelineValue ?? 0),
      ),
      churnRisk: Math.max(
        0,
        Math.min(100, Number(input.churnRisk ?? 0)),
      ),
      nps: Math.max(
        -100,
        Math.min(100, Number(input.nps ?? 0)),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_CRM_GROWTH_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as CrmGrowthDashboardSnapshot['capabilityStatus'],
    };
  }
}