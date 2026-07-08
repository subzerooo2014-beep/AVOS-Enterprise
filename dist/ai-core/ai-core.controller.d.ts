import { AiCoreService } from "./ai-core.service";
import { AiRequestDto } from "./dto/ai-request.dto";
export declare class AiCoreController {
    private service;
    constructor(service: AiCoreService);
    run(dto: AiRequestDto): Promise<import("./providers/types/ai-provider.types").AiProviderResponse>;
}
