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
exports.ResilienceActionExecutorRegistry = void 0;
const common_1 = require("@nestjs/common");
const safe_resilience_action_executor_1 = require("./safe-resilience-action.executor");
let ResilienceActionExecutorRegistry = class ResilienceActionExecutorRegistry {
    constructor(safeExecutor) {
        this.executors = [safeExecutor];
    }
    resolve(type) {
        const executor = this.executors.find((candidate) => candidate.supports(type));
        if (!executor) {
            throw new common_1.NotFoundException(`No resilience action executor supports ${type}`);
        }
        return executor;
    }
};
exports.ResilienceActionExecutorRegistry = ResilienceActionExecutorRegistry;
exports.ResilienceActionExecutorRegistry = ResilienceActionExecutorRegistry = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [safe_resilience_action_executor_1.SafeResilienceActionExecutor])
], ResilienceActionExecutorRegistry);
//# sourceMappingURL=resilience-action-executor.registry.js.map