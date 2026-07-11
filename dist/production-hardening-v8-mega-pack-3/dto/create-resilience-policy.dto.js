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
exports.CreateResiliencePolicyDto = exports.ResiliencePolicyRuleDto = exports.ResiliencePolicyConditionDto = exports.RESILIENCE_POLICY_OPERATORS = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_actor_dto_1 = require("./runtime-actor.dto");
exports.RESILIENCE_POLICY_OPERATORS = [
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "not_in",
    "contains",
    "exists",
];
class ResiliencePolicyConditionDto {
}
exports.ResiliencePolicyConditionDto = ResiliencePolicyConditionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], ResiliencePolicyConditionDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.RESILIENCE_POLICY_OPERATORS),
    __metadata("design:type", String)
], ResiliencePolicyConditionDto.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ResiliencePolicyConditionDto.prototype, "value", void 0);
class ResiliencePolicyRuleDto {
}
exports.ResiliencePolicyRuleDto = ResiliencePolicyRuleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ResiliencePolicyRuleDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], ResiliencePolicyRuleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], ResiliencePolicyRuleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ResiliencePolicyRuleDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ResiliencePolicyRuleDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ResiliencePolicyConditionDto),
    __metadata("design:type", Array)
], ResiliencePolicyRuleDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeDecision),
    __metadata("design:type", String)
], ResiliencePolicyRuleDto.prototype, "decision", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeRiskLevel),
    __metadata("design:type", String)
], ResiliencePolicyRuleDto.prototype, "riskLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ResiliencePolicyRuleDto.prototype, "requiredApprovals", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.ResilienceActionType, { each: true }),
    __metadata("design:type", Array)
], ResiliencePolicyRuleDto.prototype, "actionTypes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ResiliencePolicyRuleDto.prototype, "metadata", void 0);
class CreateResiliencePolicyDto {
}
exports.CreateResiliencePolicyDto = CreateResiliencePolicyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateResiliencePolicyDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateResiliencePolicyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateResiliencePolicyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeEnvironment),
    __metadata("design:type", String)
], CreateResiliencePolicyDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateResiliencePolicyDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ResiliencePolicyRuleDto),
    __metadata("design:type", Array)
], CreateResiliencePolicyDto.prototype, "rules", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeDecision),
    __metadata("design:type", String)
], CreateResiliencePolicyDto.prototype, "defaultDecision", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeRiskLevel),
    __metadata("design:type", String)
], CreateResiliencePolicyDto.prototype, "defaultRiskLevel", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => runtime_actor_dto_1.RuntimeActorDto),
    __metadata("design:type", runtime_actor_dto_1.RuntimeActorDto)
], CreateResiliencePolicyDto.prototype, "actor", void 0);
//# sourceMappingURL=create-resilience-policy.dto.js.map