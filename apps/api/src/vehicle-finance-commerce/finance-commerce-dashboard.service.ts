import { Injectable } from '@nestjs/common';
import {
  FinanceCommerceDashboardSnapshot,
  VEHICLE_FINANCE_COMMERCE_CAPABILITIES,
} from './vehicle-finance-commerce.types';

@Injectable()
export class FinanceCommerceDashboardService {
  snapshot(
    input: Partial<FinanceCommerceDashboardSnapshot> = {},
  ): FinanceCommerceDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      capturedPayments: Math.max(
        0,
        Math.round(input.capturedPayments ?? 0),
      ),
      activeDeposits: Math.max(
        0,
        Math.round(input.activeDeposits ?? 0),
      ),
      approvedFinancing: Math.max(
        0,
        Math.round(input.approvedFinancing ?? 0),
      ),
      issuedContracts: Math.max(
        0,
        Math.round(input.issuedContracts ?? 0),
      ),
      averageRiskScore: Math.max(
        0,
        Math.min(100, Math.round(input.averageRiskScore ?? 0)),
      ),
      capabilityStatus: Object.fromEntries(
        VEHICLE_FINANCE_COMMERCE_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as FinanceCommerceDashboardSnapshot['capabilityStatus'],
    };
  }
}