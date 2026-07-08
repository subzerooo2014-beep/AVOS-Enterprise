"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleCatalogModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const vehicle_catalog_controller_1 = require("./vehicle-catalog.controller");
const vehicle_catalog_service_1 = require("./vehicle-catalog.service");
let VehicleCatalogModule = class VehicleCatalogModule {
};
exports.VehicleCatalogModule = VehicleCatalogModule;
exports.VehicleCatalogModule = VehicleCatalogModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [vehicle_catalog_controller_1.VehicleCatalogController],
        providers: [vehicle_catalog_service_1.VehicleCatalogService],
        exports: [vehicle_catalog_service_1.VehicleCatalogService],
    })
], VehicleCatalogModule);
//# sourceMappingURL=vehicle-catalog.module.js.map