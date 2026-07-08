import { Injectable } from "@nestjs/common";
import { AiRequestDto } from "./dto/ai-request.dto";
import { PromptManagerService } from "./prompt-manager.service";
import { ModelRouterService } from "./model-router.service";
import { AiProviderRegistry } from "./providers/ai-provider.registry";

@Injectable()
export class AiCoreService {
  constructor(
    private prompts: PromptManagerService,
    private router: ModelRouterService,
    private providers: AiProviderRegistry,
  ) {}

  async run(dto: AiRequestDto) {
    const systemPrompt = this.prompts.buildSystemPrompt(dto.task);
    const model = this.router.selectModel(dto.task);
    const provider = this.providers.get();

    return provider.generate({
      prompt: dto.prompt,
      context: dto.context,
      systemPrompt,
      model,
    });
  }
}
