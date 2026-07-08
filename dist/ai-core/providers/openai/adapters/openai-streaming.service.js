"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIStreamingService = void 0;
const common_1 = require("@nestjs/common");
const openai_client_1 = require("../../openai/openai.client");
let OpenAIStreamingService = class OpenAIStreamingService {
    async stream(model, system, prompt) {
        return openai_client_1.openai.responses.create({
            model,
            stream: true,
            input: [
                {
                    role: "system",
                    content: system,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
    }
};
exports.OpenAIStreamingService = OpenAIStreamingService;
exports.OpenAIStreamingService = OpenAIStreamingService = __decorate([
    (0, common_1.Injectable)()
], OpenAIStreamingService);
//# sourceMappingURL=openai-streaming.service.js.map