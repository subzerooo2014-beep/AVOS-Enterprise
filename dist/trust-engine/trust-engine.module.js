"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustEngineModule = void 0;
const common_1 = require("@nestjs/common");
const trust_engine_controller_1 = require("./trust-engine.controller");
const trust_engine_service_1 = require("./trust-engine.service");
let TrustEngineModule = class TrustEngineModule {
};
exports.TrustEngineModule = TrustEngineModule;
exports.TrustEngineModule = TrustEngineModule = __decorate([
    (0, common_1.Module)({
        controllers: [trust_engine_controller_1.TrustEngineController],
        providers: [trust_engine_service_1.TrustEngineService],
        exports: [trust_engine_service_1.TrustEngineService],
    })
], TrustEngineModule);
//# sourceMappingURL=trust-engine.module.js.map