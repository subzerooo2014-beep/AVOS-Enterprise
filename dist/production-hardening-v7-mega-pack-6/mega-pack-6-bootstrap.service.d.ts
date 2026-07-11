import { OnModuleInit } from "@nestjs/common";
import { ComplianceBaselineService } from "./compliance-baseline.service";
import { ControlSchedulerService } from "./control-scheduler.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
export declare class MegaPack6BootstrapService implements OnModuleInit {
    private readonly storage;
    private readonly baselines;
    private readonly scheduler;
    constructor(storage: MegaPack6StorageService, baselines: ComplianceBaselineService, scheduler: ControlSchedulerService);
    onModuleInit(): Promise<void>;
    bootstrap(): Promise<Record<string, unknown>>;
    private ensureCollections;
}
