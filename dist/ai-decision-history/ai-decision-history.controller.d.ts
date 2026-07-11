import { AiDecisionHistoryService } from "./ai-decision-history.service";
export declare class AiDecisionHistoryController {
    private readonly service;
    constructor(service: AiDecisionHistoryService);
    history(id: string): Promise<any>;
}
