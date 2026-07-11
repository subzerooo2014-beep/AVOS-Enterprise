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
exports.CreateResilienceConfigurationDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_actor_dto_1 = require("./runtime-actor.dto");
class CreateResilienceConfigurationDto {
}
exports.CreateResilienceConfigurationDto = CreateResilienceConfigurationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateResilienceConfigurationDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateResilienceConfigurationDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateResilienceConfigurationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeEnvironment),
    __metadata("design:type", String)
], CreateResilienceConfigurationDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateResilienceConfigurationDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeControlMode),
    __metadata("design:type", String)
], CreateResilienceConfigurationDto.prototype, "controlMode", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(runtime_resilience_enums_1.RuntimeChangeType),
    __metadata("design:type", String)
], CreateResilienceConfigurationDto.prototype, "changeType", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateResilienceConfigurationDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateResilienceConfigurationDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateResilienceConfigurationDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreateResilienceConfigurationDto.prototype, "minimumApprovals", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => runtime_actor_dto_1.RuntimeActorDto),
    __metadata("design:type", runtime_actor_dto_1.RuntimeActorDto)
], CreateResilienceConfigurationDto.prototype, "actor", void 0);
//# sourceMappingURL=create-resilience-configuration.dto.js.map