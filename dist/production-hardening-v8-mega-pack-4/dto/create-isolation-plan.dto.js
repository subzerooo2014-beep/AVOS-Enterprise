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
exports.CreateIsolationPlanDto = exports.CreateIsolationRuleDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("../contracts");
const governance_actor_dto_1 = require("./governance-actor.dto");
class CreateIsolationRuleDto {
}
exports.CreateIsolationRuleDto = CreateIsolationRuleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateIsolationRuleDto.prototype, "nodeId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.IsolationStrategy),
    __metadata("design:type", String)
], CreateIsolationRuleDto.prototype, "strategy", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateIsolationRuleDto.prototype, "trafficPercentage", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIsolationRuleDto.prototype, "blockIncomingTraffic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIsolationRuleDto.prototype, "blockOutgoingTraffic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIsolationRuleDto.prototype, "pauseBackgroundJobs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateIsolationRuleDto.prototype, "disableDependencies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateIsolationRuleDto.prototype, "preserveDependencies", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateIsolationRuleDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIsolationRuleDto.prototype, "metadata", void 0);
class CreateIsolationPlanDto {
}
exports.CreateIsolationPlanDto = CreateIsolationPlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceEnvironment),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "sourceNodeId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.IsolationStrategy),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "strategy", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRiskLevel),
    __metadata("design:type", String)
], CreateIsolationPlanDto.prototype, "riskLevel", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateIsolationRuleDto),
    __metadata("design:type", Array)
], CreateIsolationPlanDto.prototype, "rules", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIsolationPlanDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => governance_actor_dto_1.GovernanceActorDto),
    __metadata("design:type", governance_actor_dto_1.GovernanceActorDto)
], CreateIsolationPlanDto.prototype, "actor", void 0);
//# sourceMappingURL=create-isolation-plan.dto.js.map