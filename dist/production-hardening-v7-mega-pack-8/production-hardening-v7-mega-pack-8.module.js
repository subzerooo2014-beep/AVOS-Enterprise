"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack8Module = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v7_mega_pack_8_controller_1 = require("./production-hardening-v7-mega-pack-8.controller");
const production_hardening_v7_mega_pack_8_service_1 = require("./production-hardening-v7-mega-pack-8.service");
const production_hardening_v7_mega_pack_8_store_1 = require("./production-hardening-v7-mega-pack-8.store");
let ProductionHardeningV7MegaPack8Module = class ProductionHardeningV7MegaPack8Module {
};
exports.ProductionHardeningV7MegaPack8Module = ProductionHardeningV7MegaPack8Module;
exports.ProductionHardeningV7MegaPack8Module = ProductionHardeningV7MegaPack8Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            production_hardening_v7_mega_pack_8_controller_1.ProductionHardeningV7MegaPack8Controller,
        ],
        providers: [
            production_hardening_v7_mega_pack_8_store_1.ProductionHardeningV7MegaPack8Store,
            production_hardening_v7_mega_pack_8_service_1.ProductionHardeningV7MegaPack8Service,
        ],
        exports: [
            production_hardening_v7_mega_pack_8_service_1.ProductionHardeningV7MegaPack8Service,
        ],
    })
], ProductionHardeningV7MegaPack8Module);
//# sourceMappingURL=production-hardening-v7-mega-pack-8.module.js.map