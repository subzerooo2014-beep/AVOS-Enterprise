import { GovernancePolicySimulation } from "../contracts";
import { SimulateGovernanceRequestDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceRequestService } from "./runtime-governance-request.service";
export declare class RuntimeGovernanceSimulationService {
    private readonly store;
    private readonly requests;
    constructor(store: RuntimeGovernanceStore, requests: RuntimeGovernanceRequestService);
    simulate(requestId: string, dto: SimulateGovernanceRequestDto): GovernancePolicySimulation;
    list(): GovernancePolicySimulation[];
    get(id: string): GovernancePolicySimulation;
    private calculateScenarioRisk;
    private buildFindings;
    private buildRecommendations;
}
