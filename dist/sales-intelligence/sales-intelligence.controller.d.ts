import { SalesIntelligenceService } from "./sales-intelligence.service";
import { DealScoreDto } from "./dto/deal-score.dto";
export declare class SalesIntelligenceController {
    private service;
    constructor(service: SalesIntelligenceService);
    scoreDeal(dto: DealScoreDto): {
        score: number;
        discountPercent: number;
        recommendation: string;
    };
}
