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
exports.ProductionHardeningV8MegaPack4VerificationController = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v8_mega_pack_4_verification_service_1 = require("../verification/production-hardening-v8-mega-pack-4-verification.service");
let ProductionHardeningV8MegaPack4VerificationController = class ProductionHardeningV8MegaPack4VerificationController {
    constructor(verification) {
        this.verification = verification;
    }
    run() {
        return this.verification.run();
    }
};
exports.ProductionHardeningV8MegaPack4VerificationController = ProductionHardeningV8MegaPack4VerificationController;
__decorate([
    (0, common_1.Post)("run"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack4VerificationController.prototype, "run", null);
exports.ProductionHardeningV8MegaPack4VerificationController = ProductionHardeningV8MegaPack4VerificationController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/verification"),
    __metadata("design:paramtypes", [production_hardening_v8_mega_pack_4_verification_service_1.ProductionHardeningV8MegaPack4VerificationService])
], ProductionHardeningV8MegaPack4VerificationController);
//# sourceMappingURL=production-hardening-v8-mega-pack-4-verification.controller.js.map