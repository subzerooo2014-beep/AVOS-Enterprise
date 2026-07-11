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
exports.BusinessProvidersController = void 0;
const common_1 = require("@nestjs/common");
const business_providers_service_1 = require("./business-providers.service");
let BusinessProvidersController = class BusinessProvidersController {
    constructor(service) {
        this.service = service;
    }
    createProvider(body) {
        return this.service.createProvider(body);
    }
    listProviders(type) {
        return this.service.listProviders(type);
    }
    findProvider(id) {
        return this.service.findProvider(id);
    }
    updateScore(id, body) {
        return this.service.updateProviderScore(id, body);
    }
    createOffer(body) {
        return this.service.createOffer(body);
    }
    listOffers(serviceType) {
        return this.service.listOffers(serviceType);
    }
    matchProvider(body) {
        return this.service.matchProvider(body);
    }
    listMatches() {
        return this.service.listMatches();
    }
};
exports.BusinessProvidersController = BusinessProvidersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "createProvider", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "listProviders", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "findProvider", null);
__decorate([
    (0, common_1.Patch)(":id/score"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "updateScore", null);
__decorate([
    (0, common_1.Post)("offers"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "createOffer", null);
__decorate([
    (0, common_1.Get)("offers/list"),
    __param(0, (0, common_1.Query)("serviceType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "listOffers", null);
__decorate([
    (0, common_1.Post)("match"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "matchProvider", null);
__decorate([
    (0, common_1.Get)("matches/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BusinessProvidersController.prototype, "listMatches", null);
exports.BusinessProvidersController = BusinessProvidersController = __decorate([
    (0, common_1.Controller)("business-providers"),
    __metadata("design:paramtypes", [business_providers_service_1.BusinessProvidersService])
], BusinessProvidersController);
//# sourceMappingURL=business-providers.controller.js.map