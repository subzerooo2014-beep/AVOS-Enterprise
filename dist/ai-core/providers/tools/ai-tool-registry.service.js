"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiToolRegistryService = void 0;
const common_1 = require("@nestjs/common");
let AiToolRegistryService = class AiToolRegistryService {
    constructor() {
        this.tools = new Map();
    }
    register(name, fn) {
        this.tools.set(name, fn);
    }
    async execute(name, payload) {
        const tool = this.tools.get(name);
        if (!tool)
            return { error: "TOOL_NOT_FOUND", name };
        return tool(payload);
    }
};
exports.AiToolRegistryService = AiToolRegistryService;
exports.AiToolRegistryService = AiToolRegistryService = __decorate([
    (0, common_1.Injectable)()
], AiToolRegistryService);
//# sourceMappingURL=ai-tool-registry.service.js.map