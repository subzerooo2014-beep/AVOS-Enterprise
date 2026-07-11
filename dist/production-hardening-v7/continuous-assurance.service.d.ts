import { CreateControlDto } from "./dto/create-control.dto";
import { AssuranceRun, ControlDefinition } from "./types/production-hardening-v7.types";
import { AssuranceStorageService } from "./assurance-storage.service";
export declare class ContinuousAssuranceService {
    private readonly storage;
    private readonly logger;
    private readonly controlsCollection;
    private readonly runsCollection;
    constructor(storage: AssuranceStorageService);
    seedDefaultControls(): Promise<{
        created: number;
        total: number;
    }>;
    createControl(dto: CreateControlDto): Promise<ControlDefinition>;
    listControls(): Promise<ControlDefinition[]>;
    getControl(id: string): Promise<ControlDefinition>;
    runAssurance(trigger?: string): Promise<AssuranceRun>;
    listRuns(): Promise<AssuranceRun[]>;
    getLatestRun(): Promise<AssuranceRun | null>;
    private validateControl;
    private resolveAssuranceStatus;
    private isCriticalControl;
    private pathExists;
}
