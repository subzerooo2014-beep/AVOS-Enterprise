"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMemoryService = void 0;
const common_1 = require("@nestjs/common");
let AiMemoryService = class AiMemoryService {
    constructor() {
        this.sessions = new Map();
    }
    add(sessionId, role, content) {
        const history = this.sessions.get(sessionId) ?? [];
        history.push({
            role,
            content,
            createdAt: new Date().toISOString(),
        });
        this.sessions.set(sessionId, history);
        return history;
    }
    get(sessionId) {
        return this.sessions.get(sessionId) ?? [];
    }
    clear(sessionId) {
        this.sessions.delete(sessionId);
    }
};
exports.AiMemoryService = AiMemoryService;
exports.AiMemoryService = AiMemoryService = __decorate([
    (0, common_1.Injectable)()
], AiMemoryService);
//# sourceMappingURL=ai-memory.service.js.map