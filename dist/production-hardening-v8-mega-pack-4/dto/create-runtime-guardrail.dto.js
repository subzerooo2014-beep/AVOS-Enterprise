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
exports.CreateRuntimeGuardrailDto = exports.RuntimeGuardrailConditionDto = exports.RUNTIME_GUARDRAIL_OPERATORS = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("../contracts");
const governance_actor_dto_1 = require("./governance-actor.dto");
exports.RUNTIME_GUARDRAIL_OPERATORS = [
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "not_in",
    "exists",
    "contains",
];
class RuntimeGuardrailConditionDto {
}
exports.RuntimeGuardrailConditionDto = RuntimeGuardrailConditionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], RuntimeGuardrailConditionDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.RUNTIME_GUARDRAIL_OPERATORS),
    __metadata("design:type", String)
], RuntimeGuardrailConditionDto.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], RuntimeGuardrailConditionDto.prototype, "value", void 0);
class CreateRuntimeGuardrailDto {
}
exports.CreateRuntimeGuardrailDto = CreateRuntimeGuardrailDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GuardrailType),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceEnvironment),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRequestType, { each: true }),
    __metadata("design:type", Array)
], CreateRuntimeGuardrailDto.prototype, "requestTypes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RuntimeGuardrailConditionDto),
    __metadata("design:type", Array)
], CreateRuntimeGuardrailDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceDecision),
    __metadata("design:type", String)
], CreateRuntimeGuardrailDto.prototype, "failureDecision", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRuntimeGuardrailDto.prototype, "warningOnly", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRuntimeGuardrailDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRuntimeGuardrailDto.prototype, "requiredRoles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRuntimeGuardrailDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => governance_actor_dto_1.GovernanceActorDto),
    __metadata("design:type", governance_actor_dto_1.GovernanceActorDto)
], CreateRuntimeGuardrailDto.prototype, "actor", void 0);
//# sourceMappingURL=create-runtime-guardrail.dto.js.map