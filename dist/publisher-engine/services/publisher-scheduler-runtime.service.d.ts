import { PublisherSchedulerService } from "./publisher-scheduler.service";
export declare class PublisherSchedulerRuntimeService {
    private readonly scheduler;
    constructor(scheduler: PublisherSchedulerService);
    run(limit?: number): Promise<import("..").PublisherDispatchBatchResult>;
}
