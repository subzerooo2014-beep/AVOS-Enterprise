import { Injectable } from '@nestjs/common';
import { DecisionAuditRecord } from './enterprise-strategic-governance.types';

@Injectable()
export class EnterpriseDecisionAuditService {
  private readonly records: DecisionAuditRecord[] = [];

  record(
    decisionId: string,
    actor: string,
    action: string,
    metadata: Record<string, string | number | boolean> = {},
  ): DecisionAuditRecord {
    const record: DecisionAuditRecord = {
      id: `audit-${this.records.length + 1}`,
      decisionId,
      actor,
      action,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.records.push(record);
    return { ...record };
  }

  history(decisionId?: string): DecisionAuditRecord[] {
    return this.records
      .filter((record) => !decisionId || record.decisionId === decisionId)
      .map((record) => ({ ...record }));
  }
}