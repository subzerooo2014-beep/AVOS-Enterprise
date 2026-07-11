import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { DealerPublisherRuntimeService } from "../channel-runtimes/dealer-publisher-runtime.service";
export declare class DealerPublisher {
    private readonly runtime;
    readonly channel = "dealer_network";
    constructor(runtime: DealerPublisherRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
