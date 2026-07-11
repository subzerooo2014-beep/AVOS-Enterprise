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
exports.CreateApprovalMatrixRuleDto = void 0;
const class_validator_1 = require("class-validator");
const contracts_1 = require("../contracts");
class CreateApprovalMatrixRuleDto {
}
exports.CreateApprovalMatrixRuleDto = CreateApprovalMatrixRuleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateApprovalMatrixRuleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceEnvironment),
    __metadata("design:type", String)
], CreateApprovalMatrixRuleDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRequestType, { each: true }),
    __metadata("design:type", Array)
], CreateApprovalMatrixRuleDto.prototype, "requestTypes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRiskLevel),
    __metadata("design:type", String)
], CreateApprovalMatrixRuleDto.prototype, "minimumRiskLevel", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceRiskLevel),
    __metadata("design:type", String)
], CreateApprovalMatrixRuleDto.prototype, "maximumRiskLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateApprovalMatrixRuleDto.prototype, "minimumBlastRadius", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateApprovalMatrixRuleDto.prototype, "minimumBusinessCriticality", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateApprovalMatrixRuleDto.prototype, "rollbackPlanRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateApprovalMatrixRuleDto.prototype, "minimumTestCoverage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceApprovalTier),
    __metadata("design:type", String)
], CreateApprovalMatrixRuleDto.prototype, "tier", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreateApprovalMatrixRuleDto.prototype, "requiredApprovals", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateApprovalMatrixRuleDto.prototype, "requiredRoles", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateApprovalMatrixRuleDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateApprovalMatrixRuleDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateApprovalMatrixRuleDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-approval-matrix-rule.dto.js.map