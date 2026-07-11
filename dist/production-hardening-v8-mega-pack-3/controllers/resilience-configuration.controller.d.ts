import { ApproveResilienceConfigurationDto, CreateResilienceConfigurationDto, RollbackResilienceConfigurationDto, RuntimeActorDto, SubmitResilienceConfigurationDto } from "../dto";
import { ResilienceConfigurationService } from "../services/resilience-configuration.service";
export declare class ResilienceConfigurationController {
    private readonly configurations;
    constructor(configurations: ResilienceConfigurationService);
    create(dto: CreateResilienceConfigurationDto): import("..").ResilienceConfiguration;
    list(): import("..").ResilienceConfiguration[];
    get(id: string): import("..").ResilienceConfiguration;
    submit(id: string, dto: SubmitResilienceConfigurationDto): import("..").ResilienceConfiguration;
    approve(id: string, dto: ApproveResilienceConfigurationDto): import("..").ResilienceConfiguration;
    activate(id: string, actor: RuntimeActorDto): import("..").ResilienceConfiguration;
    rollback(id: string, dto: RollbackResilienceConfigurationDto): import("..").ResilienceConfiguration;
}
