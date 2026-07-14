import { Injectable } from '@nestjs/common';
import { EnterpriseKpi } from './enterprise-strategic-governance.types';

@Injectable()
export class EnterpriseKpiIntelligenceService {
  analyze(kpis: EnterpriseKpi[]) {
    const normalized = kpis.map((kpi) => ({
      ...kpi,
      attainment:
        kpi.target === 0
          ? 100
          : Math.max(0, Math.min(100, (kpi.actual / kpi.target) * 100)),
    }));

    const weightedHealth =
      normalized.reduce(
        (sum, kpi) => sum + kpi.attainment * kpi.weight,
        0,
      ) /
      Math.max(
        1,
        normalized.reduce((sum, kpi) => sum + kpi.weight, 0),
      );

    return {
      kpis: normalized,
      health: Math.round(weightedHealth),
      underperforming: normalized
        .filter((kpi) => kpi.attainment < 70)
        .map((kpi) => kpi.id),
    };
  }
}