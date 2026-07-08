"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEngineService = void 0;
const common_1 = require("@nestjs/common");
let RiskEngineService = class RiskEngineService {
    analyze(data) {
        let risk = "LOW";
        if ((data.amount ?? 0) > 250000)
            risk = "MEDIUM";
        if ((data.amount ?? 0) > 500000)
            risk = "HIGH";
        return {
            risk,
            fraudScore: Math.round(Math.random() * 100),
            recommendation: risk === "HIGH"
                ? "Manual investigation"
                : "Continue workflow",
        };
    }
};
exports.RiskEngineService = RiskEngineService;
exports.RiskEngineService = RiskEngineService = __decorate([
    (0, common_1.Injectable)()
], RiskEngineService);
//# sourceMappingURL=risk-engine.service.js.map