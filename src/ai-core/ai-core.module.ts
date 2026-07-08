import { Module } from "@nestjs/common";
import { AiCoreController } from "./ai-core.controller";
import { AiCoreService } from "./ai-core.service";
import { PromptManagerService } from "./prompt-manager.service";
import { ModelRouterService } from "./model-router.service";
import { ToolExecutorService } from "./tool-executor.service";
import { OpenAiProvider } from "./providers/openai.provider";
import { LocalAiProvider } from "./providers/local.provider";
import { OllamaProvider } from "./providers/ollama.provider";
import { AiProviderRegistry } from "./providers/ai-provider.registry";

@Module({
  controllers: [AiCoreController],
  providers: [
    AiCoreService,
    PromptManagerService,
    ModelRouterService,
    ToolExecutorService,
    OpenAiProvider,
    LocalAiProvider,
    OllamaProvider,
    AiProviderRegistry,
  ],
  exports: [AiCoreService, ToolExecutorService, AiProviderRegistry],
})
export class AiCoreModule {}
