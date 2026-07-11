import { AnalyzeGovernanceImpactDto } from "../dto";
import { RuntimeGovernanceImpactService } from "../services";
export declare class RuntimeGovernanceImpactController {
    private readonly impact;
    constructor(impact: RuntimeGovernanceImpactService);
    analyze(requestId: string, dto: AnalyzeGovernanceImpactDto): import("..").GovernanceImpactAnalysis;
    list(): import("..").GovernanceImpactAnalysis[];
    get(id: string): import("..").GovernanceImpactAnalysis;
}
