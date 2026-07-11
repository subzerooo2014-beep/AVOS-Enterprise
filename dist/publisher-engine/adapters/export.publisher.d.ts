import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { ExportPublisherRuntimeService } from "../channel-runtimes/export-publisher-runtime.service";
export declare class ExportPublisher {
    private readonly runtime;
    readonly channel = "gcc_export";
    constructor(runtime: ExportPublisherRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
