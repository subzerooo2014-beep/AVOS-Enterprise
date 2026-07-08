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
exports.AiProviderRegistry = void 0;
const common_1 = require("@nestjs/common");
const openai_provider_1 = require("./openai.provider");
const local_provider_1 = require("./local.provider");
const ollama_provider_1 = require("./ollama.provider");
let AiProviderRegistry = class AiProviderRegistry {
    constructor(openai, local, ollama) {
        this.openai = openai;
        this.local = local;
        this.ollama = ollama;
    }
    get(provider) {
        if (provider === "ollama")
            return this.ollama;
        if (provider === "local")
            return this.local;
        return this.openai;
    }
};
exports.AiProviderRegistry = AiProviderRegistry;
exports.AiProviderRegistry = AiProviderRegistry = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_provider_1.OpenAiProvider,
        local_provider_1.LocalAiProvider,
        ollama_provider_1.OllamaProvider])
], AiProviderRegistry);
//# sourceMappingURL=ai-provider.registry.js.map