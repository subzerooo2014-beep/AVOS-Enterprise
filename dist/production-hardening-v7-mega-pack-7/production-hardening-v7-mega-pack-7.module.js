"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack7Module = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v7_mega_pack_7_controller_1 = require("./production-hardening-v7-mega-pack-7.controller");
const production_hardening_v7_mega_pack_7_service_1 = require("./production-hardening-v7-mega-pack-7.service");
const production_hardening_v7_mega_pack_7_store_1 = require("./production-hardening-v7-mega-pack-7.store");
let ProductionHardeningV7MegaPack7Module = class ProductionHardeningV7MegaPack7Module {
};
exports.ProductionHardeningV7MegaPack7Module = ProductionHardeningV7MegaPack7Module;
exports.ProductionHardeningV7MegaPack7Module = ProductionHardeningV7MegaPack7Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            production_hardening_v7_mega_pack_7_controller_1.ProductionHardeningV7MegaPack7Controller,
        ],
        providers: [
            production_hardening_v7_mega_pack_7_store_1.ProductionHardeningV7MegaPack7Store,
            production_hardening_v7_mega_pack_7_service_1.ProductionHardeningV7MegaPack7Service,
        ],
        exports: [
            production_hardening_v7_mega_pack_7_service_1.ProductionHardeningV7MegaPack7Service,
        ],
    })
], ProductionHardeningV7MegaPack7Module);
//# sourceMappingURL=production-hardening-v7-mega-pack-7.module.js.map