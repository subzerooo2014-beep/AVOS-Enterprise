import { RuntimeGovernanceRecommendationService } from "../services";
export declare class RuntimeGovernanceRecommendationController {
    private readonly recommendations;
    constructor(recommendations: RuntimeGovernanceRecommendationService);
    list(): import("..").GovernanceRecommendation[];
}
