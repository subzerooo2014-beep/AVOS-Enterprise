import { IncidentStatus } from "../enums/incident-status.enum";
import { ErrorClassification } from "../interfaces/error-classification.interface";
import { OperationalIncident } from "../interfaces/operational-incident.interface";
export declare class IncidentRegistryService {
    private readonly incidents;
    register(input: {
        fingerprint: string;
        title: string;
        message: string;
        classification: ErrorClassification;
        correlationId?: string;
        traceId?: string;
        method?: string;
        path?: string;
        metadata?: Record<string, unknown>;
    }): OperationalIncident;
    findAll(options?: {
        status?: IncidentStatus;
        limit?: number;
    }): OperationalIncident[];
    findOne(id: string): OperationalIncident | null;
    acknowledge(id: string): OperationalIncident | null;
    resolve(id: string): OperationalIncident | null;
    getSummary(): {
        total: number;
        open: number;
        acknowledged: number;
        resolved: number;
        critical: number;
        error: number;
        warning: number;
    };
    private trim;
}
