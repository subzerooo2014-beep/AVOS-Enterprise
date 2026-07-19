import { Injectable } from "@nestjs/common";
import {
  DocumentationAuditAction,
  DocumentationAuditRecord,
} from "../interfaces/documentation-workflow.types";
import { AvosDocumentStatus } from "../interfaces/documentation.types";

@Injectable()
export class DocumentationAuditService {
  private readonly records: DocumentationAuditRecord[] = [];

  record(input: {
    documentId: string;
    action: DocumentationAuditAction;
    actor: string;
    previousStatus?: AvosDocumentStatus;
    nextStatus?: AvosDocumentStatus;
    referenceId?: string;
    details?: Record<string, unknown>;
  }): DocumentationAuditRecord {
    const record: DocumentationAuditRecord = {
      id: `adf-audit:${Date.now()}:${this.records.length + 1}`,
      documentId: input.documentId,
      action: input.action,
      actor: input.actor.trim(),
      occurredAt: new Date().toISOString(),
      previousStatus: input.previousStatus,
      nextStatus: input.nextStatus,
      referenceId: input.referenceId,
      details: input.details || {},
    };

    this.records.push(record);
    return record;
  }

  list(documentId?: string): DocumentationAuditRecord[] {
    if (!documentId) {
      return [...this.records];
    }

    return this.records.filter((item) => item.documentId === documentId);
  }

  count(): number {
    return this.records.length;
  }
}
