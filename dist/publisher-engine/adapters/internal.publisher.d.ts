import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { InternalPublisherRuntimeService } from "../channel-runtimes/internal-publisher-runtime.service";
export declare class InternalPublisher {
    private readonly runtime;
    readonly channel = "internal";
    constructor(runtime: InternalPublisherRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
