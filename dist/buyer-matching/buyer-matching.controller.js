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
exports.BuyerMatchingController = void 0;
const common_1 = require("@nestjs/common");
const buyer_matching_service_1 = require("./buyer-matching.service");
let BuyerMatchingController = class BuyerMatchingController {
    constructor(service) {
        this.service = service;
    }
    createLead(body) {
        return this.service.createLead(body);
    }
    listLeads() {
        return this.service.listLeads();
    }
    match(id, body) {
        return this.service.matchBuyer(id, body);
    }
    listMatches() {
        return this.service.listMatches();
    }
};
exports.BuyerMatchingController = BuyerMatchingController;
__decorate([
    (0, common_1.Post)("leads"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BuyerMatchingController.prototype, "createLead", null);
__decorate([
    (0, common_1.Get)("leads"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuyerMatchingController.prototype, "listLeads", null);
__decorate([
    (0, common_1.Post)("leads/:id/match"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BuyerMatchingController.prototype, "match", null);
__decorate([
    (0, common_1.Get)("matches"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuyerMatchingController.prototype, "listMatches", null);
exports.BuyerMatchingController = BuyerMatchingController = __decorate([
    (0, common_1.Controller)("buyer-matching"),
    __metadata("design:paramtypes", [buyer_matching_service_1.BuyerMatchingService])
], BuyerMatchingController);
//# sourceMappingURL=buyer-matching.controller.js.map