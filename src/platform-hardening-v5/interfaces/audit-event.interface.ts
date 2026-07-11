import { AuditEventType } from "../enums/audit-event-type.enum";
import { AuditSeverity } from "../enums/audit-severity.enum";

export interface AuditEvent {
  id: string;
  sequence: number;
  type: AuditEventType;
  severity: AuditSeverity;
  action: string;
  message: string;
  actor?: string;
  correlationId?: string;
  traceId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  metadata?: Record<string, unknown>;
  previousHash: string;
  hash: string;
  createdAt: string;
}
