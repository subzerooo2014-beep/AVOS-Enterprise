import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { GoogleSearchPublisherRuntimeService } from "../social-runtimes/google-search-publisher-runtime.service";
export declare class GoogleSearchPublisher {
    private readonly runtime;
    readonly channel = "google_search";
    constructor(runtime: GoogleSearchPublisherRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
