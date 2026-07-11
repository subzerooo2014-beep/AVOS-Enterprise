"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegotiationEngineModule = void 0;
const common_1 = require("@nestjs/common");
const negotiation_engine_controller_1 = require("./negotiation-engine.controller");
const negotiation_engine_service_1 = require("./negotiation-engine.service");
let NegotiationEngineModule = class NegotiationEngineModule {
};
exports.NegotiationEngineModule = NegotiationEngineModule;
exports.NegotiationEngineModule = NegotiationEngineModule = __decorate([
    (0, common_1.Module)({
        controllers: [negotiation_engine_controller_1.NegotiationEngineController],
        providers: [negotiation_engine_service_1.NegotiationEngineService],
        exports: [negotiation_engine_service_1.NegotiationEngineService],
    })
], NegotiationEngineModule);
//# sourceMappingURL=negotiation-engine.module.js.map