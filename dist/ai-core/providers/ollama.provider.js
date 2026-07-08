"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaProvider = void 0;
const common_1 = require("@nestjs/common");
let OllamaProvider = class OllamaProvider {
    constructor() {
        this.name = "ollama";
    }
    async generate(request) {
        return {
            provider: "ollama",
            model: request.model || "llama3",
            output: "Ollama provider ready.",
            raw: request,
        };
    }
};
exports.OllamaProvider = OllamaProvider;
exports.OllamaProvider = OllamaProvider = __decorate([
    (0, common_1.Injectable)()
], OllamaProvider);
//# sourceMappingURL=ollama.provider.js.map