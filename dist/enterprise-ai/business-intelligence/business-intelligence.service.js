"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessIntelligenceService = void 0;
const common_1 = require("@nestjs/common");
let BusinessIntelligenceService = class BusinessIntelligenceService {
    dashboard(data) {
        return {
            revenue: 0,
            profit: 0,
            customers: 0,
            vehicles: 0,
            insights: ["BI Engine Ready"],
            data,
        };
    }
};
exports.BusinessIntelligenceService = BusinessIntelligenceService;
exports.BusinessIntelligenceService = BusinessIntelligenceService = __decorate([
    (0, common_1.Injectable)()
], BusinessIntelligenceService);
//# sourceMappingURL=business-intelligence.service.js.map