import { PublisherDispatcherService } from "../publisher-dispatcher.service";
export declare class PublisherBatchDispatchService {
    private readonly dispatcher;
    constructor(dispatcher: PublisherDispatcherService);
    dispatch(limit?: number): Promise<import("../publisher-dispatcher.service").PublisherDispatchBatchResult>;
}
