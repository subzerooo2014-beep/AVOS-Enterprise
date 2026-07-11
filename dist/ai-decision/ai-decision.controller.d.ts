import { AiDecisionService } from "./ai-decision.service";
export declare class AiDecisionController {
    private readonly service;
    constructor(service: AiDecisionService);
    evaluate(id: string): Promise<{
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
