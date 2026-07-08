import { DecisionEngineService } from "./decision-engine.service";
export declare class DecisionEngineController {
    private service;
    constructor(service: DecisionEngineService);
    evaluate(dto: any): {
        score: any;
        decision: string;
        confidence: number;
    };
}
