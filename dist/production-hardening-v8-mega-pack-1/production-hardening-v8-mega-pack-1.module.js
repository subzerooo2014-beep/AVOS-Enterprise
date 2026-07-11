"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV8MegaPack1Module = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v8_mega_pack_1_controller_1 = require("./production-hardening-v8-mega-pack-1.controller");
const production_hardening_v8_mega_pack_1_service_1 = require("./production-hardening-v8-mega-pack-1.service");
let ProductionHardeningV8MegaPack1Module = class ProductionHardeningV8MegaPack1Module {
};
exports.ProductionHardeningV8MegaPack1Module = ProductionHardeningV8MegaPack1Module;
exports.ProductionHardeningV8MegaPack1Module = ProductionHardeningV8MegaPack1Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            production_hardening_v8_mega_pack_1_controller_1.ProductionHardeningV8MegaPack1Controller,
        ],
        providers: [
            production_hardening_v8_mega_pack_1_service_1.ProductionHardeningV8MegaPack1Service,
        ],
        exports: [
            production_hardening_v8_mega_pack_1_service_1.ProductionHardeningV8MegaPack1Service,
        ],
    })
], ProductionHardeningV8MegaPack1Module);
//# sourceMappingURL=production-hardening-v8-mega-pack-1.module.js.map