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
exports.MultiAgentCoordinator = void 0;
const common_1 = require("@nestjs/common");
const agent_registry_service_1 = require("../registry/agent-registry.service");
const agent_planner_service_1 = require("../planner/agent-planner.service");
const agent_executor_service_1 = require("../executor/agent-executor.service");
let MultiAgentCoordinator = class MultiAgentCoordinator {
    constructor(registry, planner, executor) {
        this.registry = registry;
        this.planner = planner;
        this.executor = executor;
    }
    run(agentId, goal) {
        const agent = this.registry.find(agentId);
        const plan = this.planner.plan(goal);
        const result = this.executor.execute(plan);
        return {
            agent,
            result,
        };
    }
};
exports.MultiAgentCoordinator = MultiAgentCoordinator;
exports.MultiAgentCoordinator = MultiAgentCoordinator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agent_registry_service_1.AgentRegistryService,
        agent_planner_service_1.AgentPlanner,
        agent_executor_service_1.AgentExecutor])
], MultiAgentCoordinator);
//# sourceMappingURL=multi-agent-coordinator.service.js.map