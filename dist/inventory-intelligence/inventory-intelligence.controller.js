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
exports.InventoryIntelligenceController = void 0;
const common_1 = require("@nestjs/common");
const inventory_intelligence_service_1 = require("./inventory-intelligence.service");
const inventory_insight_dto_1 = require("./dto/inventory-insight.dto");
let InventoryIntelligenceController = class InventoryIntelligenceController {
    constructor(service) {
        this.service = service;
    }
    overview(dto) {
        return this.service.overview(dto);
    }
    slowMoving() {
        return this.service.slowMoving();
    }
};
exports.InventoryIntelligenceController = InventoryIntelligenceController;
__decorate([
    (0, common_1.Get)("overview"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_insight_dto_1.InventoryInsightDto]),
    __metadata("design:returntype", void 0)
], InventoryIntelligenceController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("slow-moving"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryIntelligenceController.prototype, "slowMoving", null);
exports.InventoryIntelligenceController = InventoryIntelligenceController = __decorate([
    (0, common_1.Controller)("inventory-intelligence"),
    __metadata("design:paramtypes", [inventory_intelligence_service_1.InventoryIntelligenceService])
], InventoryIntelligenceController);
//# sourceMappingURL=inventory-intelligence.controller.js.map