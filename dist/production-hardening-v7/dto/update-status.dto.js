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
exports.UpdateRemediationStatusDto = exports.UpdateRiskStatusDto = exports.UpdateDriftStatusDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateDriftStatusDto {
}
exports.UpdateDriftStatusDto = UpdateDriftStatusDto;
__decorate([
    (0, class_validator_1.IsIn)(["open", "acknowledged", "resolved", "ignored"]),
    __metadata("design:type", String)
], UpdateDriftStatusDto.prototype, "status", void 0);
class UpdateRiskStatusDto {
}
exports.UpdateRiskStatusDto = UpdateRiskStatusDto;
__decorate([
    (0, class_validator_1.IsIn)([
        "identified",
        "assessed",
        "mitigating",
        "accepted",
        "transferred",
        "closed",
    ]),
    __metadata("design:type", String)
], UpdateRiskStatusDto.prototype, "status", void 0);
class UpdateRemediationStatusDto {
}
exports.UpdateRemediationStatusDto = UpdateRemediationStatusDto;
__decorate([
    (0, class_validator_1.IsIn)(["open", "in_progress", "blocked", "completed", "cancelled"]),
    __metadata("design:type", String)
], UpdateRemediationStatusDto.prototype, "status", void 0);
//# sourceMappingURL=update-status.dto.js.map