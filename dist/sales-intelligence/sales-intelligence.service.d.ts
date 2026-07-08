import { DealScoreDto } from "./dto/deal-score.dto";
export declare class SalesIntelligenceService {
    scoreDeal(dto: DealScoreDto): {
        score: number;
        discountPercent: number;
        recommendation: string;
    };
}
