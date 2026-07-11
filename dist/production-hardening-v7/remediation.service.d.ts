import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateRemediationDto } from "./dto/create-remediation.dto";
import { RemediationPlan, RemediationStatus } from "./types/production-hardening-v7.types";
export declare class RemediationService {
    private readonly storage;
    private readonly collection;
    constructor(storage: AssuranceStorageService);
    create(dto: CreateRemediationDto): Promise<RemediationPlan>;
    list(status?: RemediationStatus): Promise<RemediationPlan[]>;
    updateStatus(id: string, status: RemediationStatus): Promise<RemediationPlan>;
    completeAction(planId: string, actionId: string): Promise<RemediationPlan>;
    summary(): Promise<{
        total: number;
        open: number;
        inProgress: number;
        blocked: number;
        completed: number;
        criticalOpen: number;
    }>;
}
