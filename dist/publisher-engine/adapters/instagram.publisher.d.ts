import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { InstagramPublisherRuntimeService } from "../social-runtimes/instagram-publisher-runtime.service";
export declare class InstagramPublisher {
    private readonly runtime;
    readonly channel = "instagram";
    constructor(runtime: InstagramPublisherRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
