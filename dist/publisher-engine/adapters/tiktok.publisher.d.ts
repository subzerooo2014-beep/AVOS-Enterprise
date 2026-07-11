import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { TikTokPublisherRuntimeService } from "../social-runtimes/tiktok-publisher-runtime.service";
export declare class TikTokPublisher {
    private readonly runtime;
    readonly channel = "tiktok";
    constructor(runtime: TikTokPublisherRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
