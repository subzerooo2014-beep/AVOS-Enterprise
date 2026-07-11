import { AuditEventType } from "../enums/audit-event-type.enum";
import { AuditSeverity } from "../enums/audit-severity.enum";
import { AuditEvent } from "../interfaces/audit-event.interface";
import { AuditIntegrityResult } from "../interfaces/audit-integrity-result.interface";
export declare class AuditLedgerService {
    private readonly events;
    private readonly maximumEvents;
    append(input: {
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
    }): AuditEvent;
    findAll(options?: {
        limit?: number;
        severity?: AuditSeverity;
        type?: AuditEventType;
    }): AuditEvent[];
    findOne(id: string): AuditEvent | null;
    getSummary(): {
        total: number;
        info: number;
        warning: number;
        error: number;
        critical: number;
        latestSequence: number;
        latestHash: string;
    };
    verifyIntegrity(): AuditIntegrityResult;
    private clone;
}
