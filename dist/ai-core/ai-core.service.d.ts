import { AiRequestDto } from "./dto/ai-request.dto";
import { PromptManagerService } from "./prompt-manager.service";
import { ModelRouterService } from "./model-router.service";
import { AiProviderRegistry } from "./providers/ai-provider.registry";
export declare class AiCoreService {
    private prompts;
    private router;
    private providers;
    constructor(prompts: PromptManagerService, router: ModelRouterService, providers: AiProviderRegistry);
    run(dto: AiRequestDto): Promise<import("./providers/types/ai-provider.types").AiProviderResponse>;
}
