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
exports.CreateRuntimeRunbookDto = exports.CreateRuntimeRunbookStepDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("../contracts");
const governance_actor_dto_1 = require("./governance-actor.dto");
class CreateRuntimeRunbookStepDto {
}
exports.CreateRuntimeRunbookStepDto = CreateRuntimeRunbookStepDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateRuntimeRunbookStepDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateRuntimeRunbookStepDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateRuntimeRunbookStepDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.RuntimeRunbookStepType),
    __metadata("design:type", String)
], CreateRuntimeRunbookStepDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRuntimeRunbookStepDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRuntimeRunbookStepDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3600),
    __metadata("design:type", Number)
], CreateRuntimeRunbookStepDto.prototype, "timeoutSeconds", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreateRuntimeRunbookStepDto.prototype, "retryLimit", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRuntimeRunbookStepDto.prototype, "continueOnFailure", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRuntimeRunbookStepDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRuntimeRunbookStepDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.RuntimeRunbookStepType),
    __metadata("design:type", String)
], CreateRuntimeRunbookStepDto.prototype, "rollbackStepType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRuntimeRunbookStepDto.prototype, "rollbackParameters", void 0);
class CreateRuntimeRunbookDto {
}
exports.CreateRuntimeRunbookDto = CreateRuntimeRunbookDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceEnvironment),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRequestType, { each: true }),
    __metadata("design:type", Array)
], CreateRuntimeRunbookDto.prototype, "requestTypes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRiskLevel),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "minimumRiskLevel", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRiskLevel),
    __metadata("design:type", String)
], CreateRuntimeRunbookDto.prototype, "maximumRiskLevel", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRuntimeRunbookDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRuntimeRunbookDto.prototype, "requiredRoles", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateRuntimeRunbookStepDto),
    __metadata("design:type", Array)
], CreateRuntimeRunbookDto.prototype, "steps", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRuntimeRunbookDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRuntimeRunbookDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => governance_actor_dto_1.GovernanceActorDto),
    __metadata("design:type", governance_actor_dto_1.GovernanceActorDto)
], CreateRuntimeRunbookDto.prototype, "actor", void 0);
//# sourceMappingURL=create-runtime-runbook.dto.js.map