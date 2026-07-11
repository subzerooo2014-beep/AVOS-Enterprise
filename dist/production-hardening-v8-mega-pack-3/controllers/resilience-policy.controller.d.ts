import { CreateResiliencePolicyDto, RuntimeActorDto } from "../dto";
import { ResiliencePolicyService } from "../services/resilience-policy.service";
export declare class ResiliencePolicyController {
    private readonly policies;
    constructor(policies: ResiliencePolicyService);
    create(dto: CreateResiliencePolicyDto): import("..").ResiliencePolicy;
    list(): import("..").ResiliencePolicy[];
    get(id: string): import("..").ResiliencePolicy;
    activate(id: string, actor: RuntimeActorDto): import("..").ResiliencePolicy;
    disable(id: string, actor: RuntimeActorDto): import("..").ResiliencePolicy;
}
