"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationMemoryService = void 0;
const common_1 = require("@nestjs/common");
let ConversationMemoryService = class ConversationMemoryService {
    constructor() {
        this.history = new Map();
    }
    append(sessionId, message) {
        const list = this.history.get(sessionId) ?? [];
        list.push(message);
        this.history.set(sessionId, list);
        return list;
    }
    get(sessionId) {
        return this.history.get(sessionId) ?? [];
    }
    clear(sessionId) {
        this.history.delete(sessionId);
    }
};
exports.ConversationMemoryService = ConversationMemoryService;
exports.ConversationMemoryService = ConversationMemoryService = __decorate([
    (0, common_1.Injectable)()
], ConversationMemoryService);
//# sourceMappingURL=conversation-memory.service.js.map