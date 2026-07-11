import { PublisherAiScoreService } from "./publisher-ai-score.service";
import { PublisherAiRoutingService } from "./publisher-ai-routing.service";
export declare class PublisherAiSummaryService {
    private readonly score;
    private readonly routing;
    constructor(score: PublisherAiScoreService, routing: PublisherAiRoutingService);
    analyze(job: any): {
        success: boolean;
        score: {
            success: boolean;
            score: number;
        };
        routing: {
            success: boolean;
            channel: string;
        };
        analyzedAt: Date;
    };
}
