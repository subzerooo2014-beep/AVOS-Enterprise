"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack13Module = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v7_mega_pack_13_controller_1 = require("./production-hardening-v7-mega-pack-13.controller");
const production_hardening_v7_mega_pack_13_service_1 = require("./production-hardening-v7-mega-pack-13.service");
let ProductionHardeningV7MegaPack13Module = class ProductionHardeningV7MegaPack13Module {
};
exports.ProductionHardeningV7MegaPack13Module = ProductionHardeningV7MegaPack13Module;
exports.ProductionHardeningV7MegaPack13Module = ProductionHardeningV7MegaPack13Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            production_hardening_v7_mega_pack_13_controller_1.ProductionHardeningV7MegaPack13Controller,
        ],
        providers: [
            production_hardening_v7_mega_pack_13_service_1.ProductionHardeningV7MegaPack13Service,
        ],
        exports: [
            production_hardening_v7_mega_pack_13_service_1.ProductionHardeningV7MegaPack13Service,
        ],
    })
], ProductionHardeningV7MegaPack13Module);
//# sourceMappingURL=production-hardening-v7-mega-pack-13.module.js.map