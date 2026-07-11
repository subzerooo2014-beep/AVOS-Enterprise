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
exports.RollbackConfigurationDto = exports.ReleaseKillSwitchDto = exports.ActivateKillSwitchDto = exports.CreateKillSwitchDto = exports.UpdateFeatureFlagDto = exports.CreateFeatureFlagDto = exports.CreatePolicyDto = exports.CreateBaselineDto = exports.ApproveConfigurationDto = exports.CreateConfigurationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateConfigurationDto {
}
exports.CreateConfigurationDto = CreateConfigurationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["development", "staging", "production"]),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreateConfigurationDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConfigurationDto.prototype, "sensitive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "requestedBy", void 0);
class ApproveConfigurationDto {
}
exports.ApproveConfigurationDto = ApproveConfigurationDto;
__decorate([
    (0, class_validator_1.IsIn)(["approved", "rejected"]),
    __metadata("design:type", String)
], ApproveConfigurationDto.prototype, "decision", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ApproveConfigurationDto.prototype, "approver", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], ApproveConfigurationDto.prototype, "reason", void 0);
class CreateBaselineDto {
}
exports.CreateBaselineDto = CreateBaselineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBaselineDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateBaselineDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["development", "staging", "production"]),
    __metadata("design:type", String)
], CreateBaselineDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBaselineDto.prototype, "configuration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateBaselineDto.prototype, "createdBy", void 0);
class CreatePolicyDto {
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["development", "staging", "production"]),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "keyPattern", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["low", "medium", "high", "critical"]),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePolicyDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePolicyDto.prototype, "immutableInProduction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePolicyDto.prototype, "allowedTypes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "minimumNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "maximumNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(100),
    __metadata("design:type", Array)
], CreatePolicyDto.prototype, "allowedValues", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(100),
    __metadata("design:type", Array)
], CreatePolicyDto.prototype, "blockedValues", void 0);
class CreateFeatureFlagDto {
}
exports.CreateFeatureFlagDto = CreateFeatureFlagDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["development", "staging", "production"]),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFeatureFlagDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsIn)([
        "all",
        "percentage",
        "environment",
        "service",
        "manual",
    ]),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "strategy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateFeatureFlagDto.prototype, "rolloutPercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(100),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFeatureFlagDto.prototype, "targetServices", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(1000),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFeatureFlagDto.prototype, "targetUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFeatureFlagDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "createdBy", void 0);
class UpdateFeatureFlagDto {
}
exports.UpdateFeatureFlagDto = UpdateFeatureFlagDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFeatureFlagDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([
        "all",
        "percentage",
        "environment",
        "service",
        "manual",
    ]),
    __metadata("design:type", String)
], UpdateFeatureFlagDto.prototype, "strategy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateFeatureFlagDto.prototype, "rolloutPercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(100),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateFeatureFlagDto.prototype, "targetServices", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(1000),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateFeatureFlagDto.prototype, "targetUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateFeatureFlagDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateFeatureFlagDto.prototype, "updatedBy", void 0);
class CreateKillSwitchDto {
}
exports.CreateKillSwitchDto = CreateKillSwitchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateKillSwitchDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateKillSwitchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateKillSwitchDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["development", "staging", "production"]),
    __metadata("design:type", String)
], CreateKillSwitchDto.prototype, "environment", void 0);
class ActivateKillSwitchDto {
}
exports.ActivateKillSwitchDto = ActivateKillSwitchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], ActivateKillSwitchDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ActivateKillSwitchDto.prototype, "activatedBy", void 0);
class ReleaseKillSwitchDto {
}
exports.ReleaseKillSwitchDto = ReleaseKillSwitchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ReleaseKillSwitchDto.prototype, "releasedBy", void 0);
class RollbackConfigurationDto {
}
exports.RollbackConfigurationDto = RollbackConfigurationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], RollbackConfigurationDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RollbackConfigurationDto.prototype, "automatic", void 0);
//# sourceMappingURL=production-hardening-v7-mega-pack-8.dto.js.map