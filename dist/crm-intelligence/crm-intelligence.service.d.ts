import { LeadScoreDto } from "./dto/lead-score.dto";
export declare class CrmIntelligenceService {
    scoreLead(dto: LeadScoreDto): {
        lead: LeadScoreDto;
        score: number;
        level: string;
        recommendation: string;
    };
}
