"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCoreService = void 0;
const common_1 = require("@nestjs/common");
const prompt_manager_service_1 = require("./prompt-manager.service");
const model_router_service_1 = require("./model-router.service");
const ai_provider_registry_1 = require("./providers/ai-provider.registry");
let AiCoreService = class AiCoreService {
    constructor(prompts, router, providers) {
        this.prompts = prompts;
        this.router = router;
        this.providers = providers;
    }
    async run(dto) {
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
};
exports.AiCoreService = AiCoreService;
exports.AiCoreService = AiCoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prompt_manager_service_1.PromptManagerService,
        model_router_service_1.ModelRouterService,
        ai_provider_registry_1.AiProviderRegistry])
], AiCoreService);
//# sourceMappingURL=ai-core.service.js.map