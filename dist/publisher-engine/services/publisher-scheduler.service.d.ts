import { PublisherDispatcherService } from "../publisher-dispatcher.service";
export declare class PublisherSchedulerService {
    private readonly dispatcher;
    constructor(dispatcher: PublisherDispatcherService);
    tick(limit?: number): Promise<import("../publisher-dispatcher.service").PublisherDispatchBatchResult>;
}
