import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { WebsitePublishingService } from "../website-runtime/website-publishing.service";
export declare class WebsitePublisher {
    private readonly runtime;
    readonly channel = "website";
    constructor(runtime: WebsitePublishingService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
