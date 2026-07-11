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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustController = void 0;
const common_1 = require("@nestjs/common");
const trust_service_1 = require("./trust.service");
let TrustController = class TrustController {
    constructor(service) {
        this.service = service;
    }
    calculate(body) {
        return this.service.calculate(body.entityType, body.entityId, body.factors || {});
    }
    list() {
        return this.service.list();
    }
};
exports.TrustController = TrustController;
__decorate([
    (0, common_1.Post)("calculate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrustController.prototype, "calculate", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrustController.prototype, "list", null);
exports.TrustController = TrustController = __decorate([
    (0, common_1.Controller)("trust"),
    __metadata("design:paramtypes", [trust_service_1.TrustService])
], TrustController);
//# sourceMappingURL=trust.controller.js.map