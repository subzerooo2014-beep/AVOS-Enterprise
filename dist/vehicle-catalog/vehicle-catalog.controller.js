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
exports.VehicleCatalogController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_catalog_service_1 = require("./vehicle-catalog.service");
const catalog_query_dto_1 = require("./catalog-query.dto");
const create_catalog_item_dto_1 = require("./create-catalog-item.dto");
const update_catalog_item_dto_1 = require("./update-catalog-item.dto");
let VehicleCatalogController = class VehicleCatalogController {
    constructor(service) {
        this.service = service;
    }
    summary() {
        return this.service.catalogSummary();
    }
    brands(query) {
        return this.service.brands(query);
    }
    createBrand(dto) {
        return this.service.createBrand(dto);
    }
    brand(id) {
        return this.service.brand(id);
    }
    updateBrand(id, dto) {
        return this.service.updateBrand(id, dto);
    }
    deleteBrand(id) {
        return this.service.deleteBrand(id);
    }
    models(query) {
        return this.service.models(query);
    }
    createModel(dto) {
        return this.service.createModel(dto);
    }
    model(id) {
        return this.service.model(id);
    }
    updateModel(id, dto) {
        return this.service.updateModel(id, dto);
    }
    deleteModel(id) {
        return this.service.deleteModel(id);
    }
    trims(query) {
        return this.service.trims(query);
    }
    createTrim(dto) {
        return this.service.createTrim(dto);
    }
    trim(id) {
        return this.service.trim(id);
    }
    updateTrim(id, dto) {
        return this.service.updateTrim(id, dto);
    }
    deleteTrim(id) {
        return this.service.deleteTrim(id);
    }
};
exports.VehicleCatalogController = VehicleCatalogController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('brands'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_query_dto_1.CatalogQueryDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "brands", null);
__decorate([
    (0, common_1.Post)('brands'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_item_dto_1.CreateCatalogItemDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Get)('brands/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "brand", null);
__decorate([
    (0, common_1.Patch)('brands/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_catalog_item_dto_1.UpdateCatalogItemDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "updateBrand", null);
__decorate([
    (0, common_1.Delete)('brands/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "deleteBrand", null);
__decorate([
    (0, common_1.Get)('models'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_query_dto_1.CatalogQueryDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "models", null);
__decorate([
    (0, common_1.Post)('models'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_item_dto_1.CreateCatalogItemDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "createModel", null);
__decorate([
    (0, common_1.Get)('models/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "model", null);
__decorate([
    (0, common_1.Patch)('models/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_catalog_item_dto_1.UpdateCatalogItemDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "updateModel", null);
__decorate([
    (0, common_1.Delete)('models/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "deleteModel", null);
__decorate([
    (0, common_1.Get)('trims'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_query_dto_1.CatalogQueryDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "trims", null);
__decorate([
    (0, common_1.Post)('trims'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_item_dto_1.CreateCatalogItemDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "createTrim", null);
__decorate([
    (0, common_1.Get)('trims/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "trim", null);
__decorate([
    (0, common_1.Patch)('trims/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_catalog_item_dto_1.UpdateCatalogItemDto]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "updateTrim", null);
__decorate([
    (0, common_1.Delete)('trims/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCatalogController.prototype, "deleteTrim", null);
exports.VehicleCatalogController = VehicleCatalogController = __decorate([
    (0, common_1.Controller)('vehicle-catalog'),
    __metadata("design:paramtypes", [vehicle_catalog_service_1.VehicleCatalogService])
], VehicleCatalogController);
//# sourceMappingURL=vehicle-catalog.controller.js.map