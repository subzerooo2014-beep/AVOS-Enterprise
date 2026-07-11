import { ErrorCategory } from "../enums/error-category.enum";
import { IncidentSeverity } from "../enums/incident-severity.enum";
import { IncidentStatus } from "../enums/incident-status.enum";
export interface OperationalIncident {
    id: string;
    fingerprint: string;
    title: string;
    message: string;
    category: ErrorCategory;
    severity: IncidentSeverity;
    status: IncidentStatus;
    correlationId?: string;
    traceId?: string;
    method?: string;
    path?: string;
    statusCode?: number;
    firstSeenAt: string;
    lastSeenAt: string;
    occurrenceCount: number;
    metadata?: Record<string, unknown>;
    acknowledgedAt?: string;
    resolvedAt?: string;
}
