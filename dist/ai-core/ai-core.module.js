"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCoreModule = void 0;
const common_1 = require("@nestjs/common");
const ai_core_controller_1 = require("./ai-core.controller");
const ai_core_service_1 = require("./ai-core.service");
const prompt_manager_service_1 = require("./prompt-manager.service");
const model_router_service_1 = require("./model-router.service");
const tool_executor_service_1 = require("./tool-executor.service");
const openai_provider_1 = require("./providers/openai.provider");
const local_provider_1 = require("./providers/local.provider");
const ollama_provider_1 = require("./providers/ollama.provider");
const ai_provider_registry_1 = require("./providers/ai-provider.registry");
let AiCoreModule = class AiCoreModule {
};
exports.AiCoreModule = AiCoreModule;
exports.AiCoreModule = AiCoreModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_core_controller_1.AiCoreController],
        providers: [
            ai_core_service_1.AiCoreService,
            prompt_manager_service_1.PromptManagerService,
            model_router_service_1.ModelRouterService,
            tool_executor_service_1.ToolExecutorService,
            openai_provider_1.OpenAiProvider,
            local_provider_1.LocalAiProvider,
            ollama_provider_1.OllamaProvider,
            ai_provider_registry_1.AiProviderRegistry,
        ],
        exports: [ai_core_service_1.AiCoreService, tool_executor_service_1.ToolExecutorService, ai_provider_registry_1.AiProviderRegistry],
    })
], AiCoreModule);
//# sourceMappingURL=ai-core.module.js.map