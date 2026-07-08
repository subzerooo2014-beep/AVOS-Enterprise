"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmIntelligenceService = void 0;
const common_1 = require("@nestjs/common");
let CrmIntelligenceService = class CrmIntelligenceService {
    scoreLead(dto) {
        let score = 40;
        if (dto.phone)
            score += 20;
        if (dto.source?.toLowerCase().includes("ad"))
            score += 15;
        if (dto.interest?.toLowerCase().includes("buy"))
            score += 20;
        const level = score >= 80 ? "HOT" :
            score >= 60 ? "WARM" :
                "COLD";
        return {
            lead: dto,
            score: Math.min(score, 100),
            level,
            recommendation: level === "HOT"
                ? "Contact immediately"
                : level === "WARM"
                    ? "Follow up today"
                    : "Add to nurture campaign",
        };
    }
};
exports.CrmIntelligenceService = CrmIntelligenceService;
exports.CrmIntelligenceService = CrmIntelligenceService = __decorate([
    (0, common_1.Injectable)()
], CrmIntelligenceService);
//# sourceMappingURL=crm-intelligence.service.js.map