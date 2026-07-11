"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudEngineModule = void 0;
const common_1 = require("@nestjs/common");
const fraud_engine_controller_1 = require("./fraud-engine.controller");
const fraud_engine_service_1 = require("./fraud-engine.service");
let FraudEngineModule = class FraudEngineModule {
};
exports.FraudEngineModule = FraudEngineModule;
exports.FraudEngineModule = FraudEngineModule = __decorate([
    (0, common_1.Module)({
        controllers: [fraud_engine_controller_1.FraudEngineController],
        providers: [fraud_engine_service_1.FraudEngineService],
        exports: [fraud_engine_service_1.FraudEngineService],
    })
], FraudEngineModule);
//# sourceMappingURL=fraud-engine.module.js.map