import { SimulateGovernanceRequestDto } from "../dto";
import { RuntimeGovernanceSimulationService } from "../services";
export declare class RuntimeGovernanceSimulationController {
    private readonly simulations;
    constructor(simulations: RuntimeGovernanceSimulationService);
    simulate(requestId: string, dto: SimulateGovernanceRequestDto): import("..").GovernancePolicySimulation;
    list(): import("..").GovernancePolicySimulation[];
    get(id: string): import("..").GovernancePolicySimulation;
}
