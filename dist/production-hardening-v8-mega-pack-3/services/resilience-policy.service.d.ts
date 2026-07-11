import { ResiliencePolicy, RuntimeActor } from "../contracts/runtime-resilience.contracts";
import { CreateResiliencePolicyDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
export declare class ResiliencePolicyService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService);
    create(dto: CreateResiliencePolicyDto): ResiliencePolicy;
    list(): ResiliencePolicy[];
    get(id: string): ResiliencePolicy;
    activate(id: string, actor: RuntimeActor): ResiliencePolicy;
    disable(id: string, actor: RuntimeActor): ResiliencePolicy;
}
