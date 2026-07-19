import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CertificationWorkflow,
  LifecycleRecord,
} from "./omega-workflow.types";

@Injectable()
export class CertificationLifecycleManagerService {
  private readonly records = new Map<string, LifecycleRecord[]>();

  record(
    workflow: CertificationWorkflow,
    options?: {
      readonly expiresAt?: string;
      readonly suspensionReason?: string;
      readonly revocationReason?: string;
    },
  ): LifecycleRecord {
    const record: LifecycleRecord = {
      lifecycleId: `OMEGA-LIFECYCLE-${randomUUID()}`,
      workflowId: workflow.workflowId,
      state: workflow.state,
      effectiveAt: new Date().toISOString(),
      expiresAt: options?.expiresAt,
      suspensionReason: options?.suspensionReason,
      revocationReason: options?.revocationReason,
    };

    const current = this.records.get(workflow.workflowId) ?? [];
    this.records.set(workflow.workflowId, [...current, record]);

    return record;
  }

  history(workflowId: string): readonly LifecycleRecord[] {
    return this.records.get(workflowId) ?? [];
  }
}
