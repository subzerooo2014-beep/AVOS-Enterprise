import { ControlSchedulerService } from "./control-scheduler.service";
import { CreateControlScheduleDto } from "./dto/create-control-schedule.dto";
import { SetEnabledDto } from "./dto/set-enabled.dto";
export declare class ControlSchedulerController {
    private readonly scheduler;
    constructor(scheduler: ControlSchedulerService);
    create(dto: CreateControlScheduleDto): Promise<import("./automation.types").ControlSchedule>;
    list(): Promise<import("./automation.types").ControlSchedule[]>;
    get(id: string): Promise<import("./automation.types").ControlSchedule>;
    runDue(): Promise<{
        evaluated: number;
        due: number;
        completed: number;
        failed: number;
        runs: import("./automation.types").SchedulerRun[];
    }>;
    runNow(id: string): Promise<import("./automation.types").SchedulerRun>;
    setEnabled(id: string, dto: SetEnabledDto): Promise<import("./automation.types").ControlSchedule>;
}
