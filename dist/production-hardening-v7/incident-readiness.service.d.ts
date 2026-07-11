import { AssuranceStorageService } from "./assurance-storage.service";
import { IncidentReadinessAssessment } from "./types/production-hardening-v7.types";
export declare class IncidentReadinessService {
    private readonly storage;
    private readonly collection;
    constructor(storage: AssuranceStorageService);
    assess(): Promise<IncidentReadinessAssessment>;
    list(): Promise<IncidentReadinessAssessment[]>;
    latest(): Promise<IncidentReadinessAssessment | null>;
}
