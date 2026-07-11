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
exports.CaptureRuntimeBaselineDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_actor_dto_1 = require("./runtime-actor.dto");
class CaptureRuntimeBaselineDto {
}
exports.CaptureRuntimeBaselineDto = CaptureRuntimeBaselineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CaptureRuntimeBaselineDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CaptureRuntimeBaselineDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeEnvironment),
    __metadata("design:type", String)
], CaptureRuntimeBaselineDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CaptureRuntimeBaselineDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CaptureRuntimeBaselineDto.prototype, "configurationIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CaptureRuntimeBaselineDto.prototype, "signalSnapshot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CaptureRuntimeBaselineDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => runtime_actor_dto_1.RuntimeActorDto),
    __metadata("design:type", runtime_actor_dto_1.RuntimeActorDto)
], CaptureRuntimeBaselineDto.prototype, "actor", void 0);
//# sourceMappingURL=capture-runtime-baseline.dto.js.map