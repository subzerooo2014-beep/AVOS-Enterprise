import { RecommendationEngineService } from "./recommendation-engine.service";
export declare class RecommendationEngineController {
    private service;
    constructor(service: RecommendationEngineService);
    recommend(dto: any): {
        recommendations: string[];
        vehicle: any;
    };
}
