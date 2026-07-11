import { PublisherDispatcherService } from "../publisher-dispatcher.service";
export declare class PublisherJobExecutorService {
    private readonly dispatcher;
    constructor(dispatcher: PublisherDispatcherService);
    execute(limit?: number): Promise<import("../publisher-dispatcher.service").PublisherDispatchBatchResult>;
    executeOne(id: string): Promise<unknown>;
}
