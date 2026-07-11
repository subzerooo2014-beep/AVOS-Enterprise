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
exports.CreateCapacityPolicyDto = exports.CapacityPolicyThresholdDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("../contracts");
const governance_actor_dto_1 = require("./governance-actor.dto");
class CapacityPolicyThresholdDto {
}
exports.CapacityPolicyThresholdDto = CapacityPolicyThresholdDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CapacityPolicyThresholdDto.prototype, "warning", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CapacityPolicyThresholdDto.prototype, "critical", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CapacityPolicyThresholdDto.prototype, "scaleOut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CapacityPolicyThresholdDto.prototype, "scaleIn", void 0);
class CreateCapacityPolicyDto {
}
exports.CreateCapacityPolicyDto = CreateCapacityPolicyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceEnvironment),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.CapacityMetricType),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "metricType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateCapacityPolicyDto.prototype, "metricName", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CapacityPolicyThresholdDto),
    __metadata("design:type", CapacityPolicyThresholdDto)
], CreateCapacityPolicyDto.prototype, "thresholds", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateCapacityPolicyDto.prototype, "minimumInstances", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateCapacityPolicyDto.prototype, "maximumInstances", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCapacityPolicyDto.prototype, "scaleStep", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCapacityPolicyDto.prototype, "cooldownSeconds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCapacityPolicyDto.prototype, "allowAutomaticScaling", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCapacityPolicyDto.prototype, "blockChangesWhenCritical", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCapacityPolicyDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => governance_actor_dto_1.GovernanceActorDto),
    __metadata("design:type", governance_actor_dto_1.GovernanceActorDto)
], CreateCapacityPolicyDto.prototype, "actor", void 0);
//# sourceMappingURL=create-capacity-policy.dto.js.map