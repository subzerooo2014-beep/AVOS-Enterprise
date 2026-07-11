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
exports.CreateGovernanceArchiveDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("../contracts");
const governance_actor_dto_1 = require("./governance-actor.dto");
class CreateGovernanceArchiveDto {
}
exports.CreateGovernanceArchiveDto = CreateGovernanceArchiveDto;
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceArchiveType),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceDataClassification),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "classification", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.GovernanceEnvironment),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "namespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateGovernanceArchiveDto.prototype, "sourceResourceIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "checkpointId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGovernanceArchiveDto.prototype, "compressed", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGovernanceArchiveDto.prototype, "encrypted", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGovernanceArchiveDto.prototype, "immutable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "retentionPolicyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateGovernanceArchiveDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateGovernanceArchiveDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => governance_actor_dto_1.GovernanceActorDto),
    __metadata("design:type", governance_actor_dto_1.GovernanceActorDto)
], CreateGovernanceArchiveDto.prototype, "actor", void 0);
//# sourceMappingURL=create-governance-archive.dto.js.map