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
exports.RecordRuntimeSignalDto = void 0;
const class_validator_1 = require("class-validator");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
class RecordRuntimeSignalDto {
}
exports.RecordRuntimeSignalDto = RecordRuntimeSignalDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeEnvironment),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeSignalType),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeSignalStatus),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RecordRuntimeSignalDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RecordRuntimeSignalDto.prototype, "thresholdWarning", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RecordRuntimeSignalDto.prototype, "thresholdCritical", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RecordRuntimeSignalDto.prototype, "labels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RecordRuntimeSignalDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], RecordRuntimeSignalDto.prototype, "observedAt", void 0);
//# sourceMappingURL=record-runtime-signal.dto.js.map