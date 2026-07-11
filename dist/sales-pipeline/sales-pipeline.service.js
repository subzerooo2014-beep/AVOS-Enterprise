"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesPipelineService = void 0;
const common_1 = require("@nestjs/common");
let SalesPipelineService = class SalesPipelineService {
    nextStage(stage) {
        const flow = ["NEW", "CONTACTED", "NEGOTIATION", "WON"];
        const index = flow.indexOf(stage);
        return index >= 0 && index < flow.length - 1 ? flow[index + 1] : stage;
    }
    calculateProbability(stage) {
        if (stage === "WON")
            return 100;
        if (stage === "NEGOTIATION")
            return 70;
        if (stage === "CONTACTED")
            return 40;
        return 10;
    }
};
exports.SalesPipelineService = SalesPipelineService;
exports.SalesPipelineService = SalesPipelineService = __decorate([
    (0, common_1.Injectable)()
], SalesPipelineService);
//# sourceMappingURL=sales-pipeline.service.js.map