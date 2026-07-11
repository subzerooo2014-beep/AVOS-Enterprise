import { PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
import { CrmPublisherRuntimeService } from "../channel-runtimes/crm-publisher-runtime.service";
export declare class CrmPublisher {
    private readonly runtime;
    readonly channel = "crm_leads";
    constructor(runtime: CrmPublisherRuntimeService);
    health(): Promise<PublisherStatus>;
    publish(context: PublisherContext): Promise<PublisherResult>;
}
