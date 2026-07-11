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
exports.RuntimeResilienceVerificationController = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_verification_service_1 = require("../verification/runtime-resilience-verification.service");
let RuntimeResilienceVerificationController = class RuntimeResilienceVerificationController {
    constructor(verification) {
        this.verification = verification;
    }
    verify() {
        return this.verification.verify();
    }
};
exports.RuntimeResilienceVerificationController = RuntimeResilienceVerificationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeResilienceVerificationController.prototype, "verify", null);
exports.RuntimeResilienceVerificationController = RuntimeResilienceVerificationController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/verification"),
    __metadata("design:paramtypes", [runtime_resilience_verification_service_1.RuntimeResilienceVerificationService])
], RuntimeResilienceVerificationController);
//# sourceMappingURL=runtime-resilience-verification.controller.js.map