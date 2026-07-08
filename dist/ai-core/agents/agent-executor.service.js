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
exports.AgentExecutorService = void 0;
const common_1 = require("@nestjs/common");
const agent_planner_service_1 = require("../planner/agent-planner.service");
const conversation_memory_service_1 = require("../memory/conversation-memory.service");
const context_builder_service_1 = require("../context/context-builder.service");
let AgentExecutorService = class AgentExecutorService {
    constructor(planner, memory, context) {
        this.planner = planner;
        this.memory = memory;
        this.context = context;
    }
    execute(sessionId, input) {
        const history = this.memory.get(sessionId);
        const ctx = this.context.build(input, history);
        const plan = this.planner.plan(input.prompt);
        this.memory.append(sessionId, {
            role: "user",
            content: input.prompt
        });
        return {
            context: ctx,
            plan,
            status: "READY_FOR_PROVIDER"
        };
    }
};
exports.AgentExecutorService = AgentExecutorService;
exports.AgentExecutorService = AgentExecutorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agent_planner_service_1.AgentPlannerService,
        conversation_memory_service_1.ConversationMemoryService,
        context_builder_service_1.ContextBuilderService])
], AgentExecutorService);
//# sourceMappingURL=agent-executor.service.js.map