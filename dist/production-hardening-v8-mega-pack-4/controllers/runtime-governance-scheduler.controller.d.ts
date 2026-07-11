import { CreateGovernanceScheduleDto, GovernanceActorDto, UpdateGovernanceScheduleStatusDto } from "../dto";
import { RuntimeGovernanceSchedulerService } from "../services";
export declare class RuntimeGovernanceSchedulerController {
    private readonly schedules;
    constructor(schedules: RuntimeGovernanceSchedulerService);
    create(dto: CreateGovernanceScheduleDto): import("..").GovernanceSchedule;
    list(): import("..").GovernanceSchedule[];
    listRuns(): import("..").GovernanceScheduleRun[];
    get(id: string): import("..").GovernanceSchedule;
    updateStatus(id: string, dto: UpdateGovernanceScheduleStatusDto): import("..").GovernanceSchedule;
    runDue(actor: GovernanceActorDto): import("..").GovernanceScheduleRun[];
}
