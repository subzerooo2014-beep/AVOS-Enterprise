import { AiResultsService } from "../ai-results/ai-results.service";
import { AiDecisionHistoryService } from "../ai-decision-history/ai-decision-history.service";
export declare class AiDecisionService {
    private readonly results;
    private readonly history;
    constructor(results: AiResultsService, history: AiDecisionHistoryService);
    evaluateVehicle(vehicleId: string): Promise<{
        overallDecision: string;
        recommendedPrice: any;
        estimatedPrice: any;
        actions: string[];
        summary: {
            fraud: any;
            trust: any;
            buyer: any;
            marketing: any;
            exportOpportunity: any;
            valuation: any;
        };
    }>;
}
