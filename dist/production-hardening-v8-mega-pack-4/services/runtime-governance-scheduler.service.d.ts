import { GovernanceSchedule, GovernanceScheduleRun } from "../contracts";
import { CreateGovernanceScheduleDto, UpdateGovernanceScheduleStatusDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceTimelineService } from "./runtime-governance-timeline.service";
export declare class RuntimeGovernanceSchedulerService {
    private readonly store;
    private readonly timeline;
    constructor(store: RuntimeGovernanceStore, timeline: RuntimeGovernanceTimelineService);
    create(dto: CreateGovernanceScheduleDto): GovernanceSchedule;
    list(): GovernanceSchedule[];
    get(id: string): GovernanceSchedule;
    updateStatus(id: string, dto: UpdateGovernanceScheduleStatusDto): GovernanceSchedule;
    runDue(actor: {
        id: string;
        type: "user" | "service" | "system" | "automation";
        name?: string;
        roles: string[];
    }): GovernanceScheduleRun[];
    listRuns(): GovernanceScheduleRun[];
    private executeSchedule;
    private normalizeSchedules;
    private calculateNextRun;
}
