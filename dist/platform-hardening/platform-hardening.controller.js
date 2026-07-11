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
exports.PlatformHardeningController = void 0;
const common_1 = require("@nestjs/common");
const platform_hardening_service_1 = require("./platform-hardening.service");
let PlatformHardeningController = class PlatformHardeningController {
    constructor(service) {
        this.service = service;
    }
    status() {
        return this.service.status();
    }
    errorTest() {
        throw new Error("AVOS controlled exception test.");
    }
};
exports.PlatformHardeningController = PlatformHardeningController;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningController.prototype, "status", null);
__decorate([
    (0, common_1.Get)("error-test"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningController.prototype, "errorTest", null);
exports.PlatformHardeningController = PlatformHardeningController = __decorate([
    (0, common_1.Controller)("platform-hardening"),
    __metadata("design:paramtypes", [platform_hardening_service_1.PlatformHardeningService])
], PlatformHardeningController);
//# sourceMappingURL=platform-hardening.controller.js.map