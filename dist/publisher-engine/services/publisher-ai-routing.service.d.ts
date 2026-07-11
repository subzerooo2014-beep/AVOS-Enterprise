import { PublisherDecisionService } from "./publisher-decision.service";
export declare class PublisherAiRoutingService {
    private readonly decision;
    constructor(decision: PublisherDecisionService);
    route(job: any): {
        success: boolean;
        channel: string;
    };
}
