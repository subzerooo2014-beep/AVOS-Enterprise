import { CreateControlScheduleDto } from "./dto/create-control-schedule.dto";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { ControlSchedule, SchedulerRun } from "./automation.types";
export declare class ControlSchedulerService {
    private readonly storage;
    private readonly events;
    constructor(storage: MegaPack6StorageService, events: PlatformEventBusService);
    create(dto: CreateControlScheduleDto): Promise<ControlSchedule>;
    list(): Promise<ControlSchedule[]>;
    get(id: string): Promise<ControlSchedule>;
    runDue(): Promise<{
        evaluated: number;
        due: number;
        completed: number;
        failed: number;
        runs: SchedulerRun[];
    }>;
    runNow(id: string): Promise<SchedulerRun>;
    enable(id: string, enabled: boolean): Promise<ControlSchedule>;
    seedDefaults(): Promise<{
        created: number;
        total: number;
    }>;
    private executeSchedule;
    private executeHandler;
    private updateScheduleAfterRun;
    private calculateNextRun;
}
