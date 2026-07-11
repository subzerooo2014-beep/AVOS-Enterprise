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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack9Controller = void 0;
const common_1 = require("@nestjs/common");
const create_checkpoint_dto_1 = require("./dto/create-checkpoint.dto");
const create_continuity_exercise_dto_1 = require("./dto/create-continuity-exercise.dto");
const create_failure_simulation_dto_1 = require("./dto/create-failure-simulation.dto");
const create_recovery_plan_dto_1 = require("./dto/create-recovery-plan.dto");
const create_resilience_profile_dto_1 = require("./dto/create-resilience-profile.dto");
const execute_recovery_plan_dto_1 = require("./dto/execute-recovery-plan.dto");
const record_dependency_health_dto_1 = require("./dto/record-dependency-health.dto");
const production_hardening_v7_mega_pack_9_service_1 = require("./production-hardening-v7-mega-pack-9.service");
let ProductionHardeningV7MegaPack9Controller = class ProductionHardeningV7MegaPack9Controller {
    constructor(service) {
        this.service = service;
    }
    getStatus() {
        return this.service.getStatus();
    }
    getSnapshot() {
        return {
            success: true,
            snapshot: this.service.getSnapshot(),
        };
    }
    verify() {
        return this.service.runVerification();
    }
    verifyEvidenceChain() {
        return {
            success: true,
            ...this.service.verifyEvidenceChain(),
        };
    }
    listEvidence() {
        return {
            success: true,
            entries: this.service.listEvidenceEntries(),
        };
    }
    listEvents() {
        return {
            success: true,
            events: this.service.listPlatformEvents(),
        };
    }
    createProfile(dto) {
        return {
            success: true,
            profile: this.service.createProfile(dto, "api"),
        };
    }
    listProfiles() {
        return {
            success: true,
            profiles: this.service.listProfiles(),
        };
    }
    getProfile(profileId) {
        return {
            success: true,
            profile: this.service.getProfile(profileId),
        };
    }
    activateProfile(profileId) {
        return {
            success: true,
            profile: this.service.activateProfile(profileId, "api"),
        };
    }
    createRecoveryPlan(dto) {
        return {
            success: true,
            recoveryPlan: this.service.createRecoveryPlan(dto, "api"),
        };
    }
    listRecoveryPlans(profileId) {
        return {
            success: true,
            recoveryPlans: this.service.listRecoveryPlans(profileId),
        };
    }
    getRecoveryPlan(planId) {
        return {
            success: true,
            recoveryPlan: this.service.getRecoveryPlan(planId),
        };
    }
    approveRecoveryPlan(planId) {
        return {
            success: true,
            recoveryPlan: this.service.approveRecoveryPlan(planId, "api"),
        };
    }
    executeRecoveryPlan(planId, dto) {
        return {
            success: true,
            execution: this.service.executeRecoveryPlan(planId, dto),
        };
    }
    listRecoveryExecutions(planId) {
        return {
            success: true,
            executions: this.service.listExecutions(planId),
        };
    }
    getRecoveryExecution(executionId) {
        return {
            success: true,
            execution: this.service.getExecution(executionId),
        };
    }
    createContinuityExercise(dto) {
        return {
            success: true,
            exercise: this.service.createContinuityExercise(dto, "api"),
        };
    }
    listContinuityExercises() {
        return {
            success: true,
            exercises: this.service.listContinuityExercises(),
        };
    }
    runContinuityExercise(exerciseId) {
        return {
            success: true,
            exercise: this.service.runContinuityExercise(exerciseId, "api"),
        };
    }
    recordDependencyHealth(dto) {
        return {
            success: true,
            dependency: this.service.recordDependencyHealth(dto, "api"),
        };
    }
    listDependencyHealth() {
        return {
            success: true,
            dependencies: this.service.listDependencyHealth(),
        };
    }
    createCheckpoint(dto) {
        return {
            success: true,
            checkpoint: this.service.createCheckpoint(dto, "api"),
        };
    }
    listCheckpoints() {
        return {
            success: true,
            checkpoints: this.service.listCheckpoints(),
        };
    }
    verifyCheckpoint(checkpointId) {
        return {
            success: true,
            checkpoint: this.service.verifyCheckpoint(checkpointId, "api"),
        };
    }
    restoreCheckpoint(checkpointId) {
        return {
            success: true,
            checkpoint: this.service.restoreCheckpoint(checkpointId, "api"),
        };
    }
    createFailureSimulation(dto) {
        return {
            success: true,
            simulation: this.service.createFailureSimulation(dto, "api"),
        };
    }
    listFailureSimulations() {
        return {
            success: true,
            simulations: this.service.listFailureSimulations(),
        };
    }
    runFailureSimulation(simulationId) {
        return {
            success: true,
            simulation: this.service.runFailureSimulation(simulationId, "api"),
        };
    }
};
exports.ProductionHardeningV7MegaPack9Controller = ProductionHardeningV7MegaPack9Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "verifyEvidenceChain", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listEvidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listEvents", null);
__decorate([
    (0, common_1.Post)("profiles"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_resilience_profile_dto_1.CreateResilienceProfileDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)("profiles"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listProfiles", null);
__decorate([
    (0, common_1.Get)("profiles/:profileId"),
    __param(0, (0, common_1.Param)("profileId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)("profiles/:profileId/activate"),
    __param(0, (0, common_1.Param)("profileId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "activateProfile", null);
__decorate([
    (0, common_1.Post)("recovery-plans"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_recovery_plan_dto_1.CreateRecoveryPlanDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "createRecoveryPlan", null);
__decorate([
    (0, common_1.Get)("recovery-plans"),
    __param(0, (0, common_1.Query)("profileId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listRecoveryPlans", null);
__decorate([
    (0, common_1.Get)("recovery-plans/:planId"),
    __param(0, (0, common_1.Param)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "getRecoveryPlan", null);
__decorate([
    (0, common_1.Post)("recovery-plans/:planId/approve"),
    __param(0, (0, common_1.Param)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "approveRecoveryPlan", null);
__decorate([
    (0, common_1.Post)("recovery-plans/:planId/execute"),
    __param(0, (0, common_1.Param)("planId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_recovery_plan_dto_1.ExecuteRecoveryPlanDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "executeRecoveryPlan", null);
__decorate([
    (0, common_1.Get)("recovery-executions"),
    __param(0, (0, common_1.Query)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listRecoveryExecutions", null);
__decorate([
    (0, common_1.Get)("recovery-executions/:executionId"),
    __param(0, (0, common_1.Param)("executionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "getRecoveryExecution", null);
__decorate([
    (0, common_1.Post)("continuity-exercises"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_continuity_exercise_dto_1.CreateContinuityExerciseDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "createContinuityExercise", null);
__decorate([
    (0, common_1.Get)("continuity-exercises"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listContinuityExercises", null);
__decorate([
    (0, common_1.Post)("continuity-exercises/:exerciseId/run"),
    __param(0, (0, common_1.Param)("exerciseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "runContinuityExercise", null);
__decorate([
    (0, common_1.Post)("dependencies/health"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_dependency_health_dto_1.RecordDependencyHealthDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "recordDependencyHealth", null);
__decorate([
    (0, common_1.Get)("dependencies/health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listDependencyHealth", null);
__decorate([
    (0, common_1.Post)("checkpoints"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_checkpoint_dto_1.CreateCheckpointDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "createCheckpoint", null);
__decorate([
    (0, common_1.Get)("checkpoints"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listCheckpoints", null);
__decorate([
    (0, common_1.Post)("checkpoints/:checkpointId/verify"),
    __param(0, (0, common_1.Param)("checkpointId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "verifyCheckpoint", null);
__decorate([
    (0, common_1.Post)("checkpoints/:checkpointId/restore"),
    __param(0, (0, common_1.Param)("checkpointId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "restoreCheckpoint", null);
__decorate([
    (0, common_1.Post)("failure-simulations"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_failure_simulation_dto_1.CreateFailureSimulationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "createFailureSimulation", null);
__decorate([
    (0, common_1.Get)("failure-simulations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "listFailureSimulations", null);
__decorate([
    (0, common_1.Post)("failure-simulations/:simulationId/run"),
    __param(0, (0, common_1.Param)("simulationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack9Controller.prototype, "runFailureSimulation", null);
exports.ProductionHardeningV7MegaPack9Controller = ProductionHardeningV7MegaPack9Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-9"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_9_service_1.ProductionHardeningV7MegaPack9Service])
], ProductionHardeningV7MegaPack9Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-9.controller.js.map