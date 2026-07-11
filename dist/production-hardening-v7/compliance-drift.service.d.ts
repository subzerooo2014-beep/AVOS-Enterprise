import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateDriftEventDto } from "./dto/create-drift-event.dto";
import { ComplianceDriftEvent } from "./types/production-hardening-v7.types";
export declare class ComplianceDriftService {
    private readonly storage;
    private readonly collection;
    constructor(storage: AssuranceStorageService);
    detect(dto: CreateDriftEventDto): Promise<ComplianceDriftEvent>;
    list(status?: ComplianceDriftEvent["status"]): Promise<ComplianceDriftEvent[]>;
    updateStatus(id: string, status: ComplianceDriftEvent["status"]): Promise<ComplianceDriftEvent>;
    summary(): Promise<{
        total: number;
        open: number;
        acknowledged: number;
        resolved: number;
        ignored: number;
        criticalOpen: number;
    }>;
    private createFingerprint;
    private stableStringify;
}
