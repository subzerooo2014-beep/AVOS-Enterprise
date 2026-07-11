import { ResilienceConfiguration, RuntimeActor } from "../contracts/runtime-resilience.contracts";
import { ApproveResilienceConfigurationDto, CreateResilienceConfigurationDto, RollbackResilienceConfigurationDto, SubmitResilienceConfigurationDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
export declare class ResilienceConfigurationService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService);
    create(dto: CreateResilienceConfigurationDto): ResilienceConfiguration;
    list(): ResilienceConfiguration[];
    get(id: string): ResilienceConfiguration;
    submit(id: string, dto: SubmitResilienceConfigurationDto): ResilienceConfiguration;
    approve(id: string, dto: ApproveResilienceConfigurationDto): ResilienceConfiguration;
    activate(id: string, actor: RuntimeActor): ResilienceConfiguration;
    rollback(id: string, dto: RollbackResilienceConfigurationDto): ResilienceConfiguration;
}
