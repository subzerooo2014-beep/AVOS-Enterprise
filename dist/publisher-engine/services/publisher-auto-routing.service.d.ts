import { PublisherDecisionService } from "./publisher-decision.service";
export declare class PublisherAutoRoutingService {
    private readonly decision;
    constructor(decision: PublisherDecisionService);
    route(job: any): {
        channel: string;
        generatedAt: Date;
    };
}
