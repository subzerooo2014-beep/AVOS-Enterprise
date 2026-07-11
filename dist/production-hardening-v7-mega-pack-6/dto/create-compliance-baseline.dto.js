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
exports.CreateComplianceBaselineDto = exports.CreateBaselineControlDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateBaselineControlDto {
}
exports.CreateBaselineControlDto = CreateBaselineControlDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBaselineControlDto.prototype, "controlCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBaselineControlDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBaselineControlDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsIn)([
        "informational",
        "low",
        "medium",
        "high",
        "critical",
    ]),
    __metadata("design:type", String)
], CreateBaselineControlDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsIn)([
        "equals",
        "not_equals",
        "contains",
        "exists",
        "not_exists",
        "greater_than",
        "less_than",
        "custom",
    ]),
    __metadata("design:type", String)
], CreateBaselineControlDto.prototype, "comparisonType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBaselineControlDto.prototype, "expectedValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBaselineControlDto.prototype, "resourcePath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBaselineControlDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBaselineControlDto.prototype, "metadata", void 0);
class CreateComplianceBaselineDto {
}
exports.CreateComplianceBaselineDto = CreateComplianceBaselineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "baselineCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "domain", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "owner", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateComplianceBaselineDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "effectiveUntil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComplianceBaselineDto.prototype, "supersedesBaselineId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateBaselineControlDto),
    __metadata("design:type", Array)
], CreateComplianceBaselineDto.prototype, "controls", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateComplianceBaselineDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-compliance-baseline.dto.js.map