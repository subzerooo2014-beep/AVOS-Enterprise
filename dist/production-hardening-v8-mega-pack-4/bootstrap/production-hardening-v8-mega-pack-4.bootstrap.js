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
var ProductionHardeningV8MegaPack4Bootstrap_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV8MegaPack4Bootstrap = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let ProductionHardeningV8MegaPack4Bootstrap = ProductionHardeningV8MegaPack4Bootstrap_1 = class ProductionHardeningV8MegaPack4Bootstrap {
    constructor(store) {
        this.store = store;
        this.logger = new common_1.Logger(ProductionHardeningV8MegaPack4Bootstrap_1.name);
    }
    onApplicationBootstrap() {
        if (!this.store.getControlMode()) {
            this.store.setControlMode(contracts_1.GovernanceControlMode.ENFORCE);
        }
        this.logger.log("AVOS Production Hardening V8 — Mega Pack 4 initialized.");
    }
};
exports.ProductionHardeningV8MegaPack4Bootstrap = ProductionHardeningV8MegaPack4Bootstrap;
exports.ProductionHardeningV8MegaPack4Bootstrap = ProductionHardeningV8MegaPack4Bootstrap = ProductionHardeningV8MegaPack4Bootstrap_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], ProductionHardeningV8MegaPack4Bootstrap);
//# sourceMappingURL=production-hardening-v8-mega-pack-4.bootstrap.js.map