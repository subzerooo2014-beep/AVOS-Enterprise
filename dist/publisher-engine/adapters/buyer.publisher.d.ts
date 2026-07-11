import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { BuyerMatchingRuntimeService } from "../channel-runtimes/buyer-matching-runtime.service";
export declare class BuyerPublisher {
    private readonly runtime;
    readonly channel = "matched_buyers";
    constructor(runtime: BuyerMatchingRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
