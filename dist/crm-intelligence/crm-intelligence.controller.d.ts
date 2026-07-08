import { CrmIntelligenceService } from "./crm-intelligence.service";
import { LeadScoreDto } from "./dto/lead-score.dto";
export declare class CrmIntelligenceController {
    private service;
    constructor(service: CrmIntelligenceService);
    scoreLead(dto: LeadScoreDto): {
        lead: LeadScoreDto;
        score: number;
        level: string;
        recommendation: string;
    };
}
