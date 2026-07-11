import { PublisherBatchDispatchService } from "./publisher-batch-dispatch.service";
export declare class PublisherBatchRuntimeService {
    private readonly batch;
    constructor(batch: PublisherBatchDispatchService);
    execute(limit?: number): Promise<import("..").PublisherDispatchBatchResult>;
}
