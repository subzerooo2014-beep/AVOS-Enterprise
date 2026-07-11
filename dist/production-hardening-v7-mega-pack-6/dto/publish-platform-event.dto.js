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
exports.PublishPlatformEventDto = void 0;
const class_validator_1 = require("class-validator");
class PublishPlatformEventDto {
}
exports.PublishPlatformEventDto = PublishPlatformEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublishPlatformEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublishPlatformEventDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsIn)([
        "informational",
        "low",
        "medium",
        "high",
        "critical",
    ]),
    __metadata("design:type", String)
], PublishPlatformEventDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublishPlatformEventDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublishPlatformEventDto.prototype, "entityId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PublishPlatformEventDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublishPlatformEventDto.prototype, "correlationId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublishPlatformEventDto.prototype, "causationId", void 0);
//# sourceMappingURL=publish-platform-event.dto.js.map