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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeGovernanceImpactController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceImpactController = class RuntimeGovernanceImpactController {
    constructor(impact) {
        this.impact = impact;
    }
    analyze(requestId, dto) {
        return this.impact
            .analyze(requestId, dto);
    }
    list() {
        return this.impact.list();
    }
    get(id) {
        return this.impact.get(id);
    }
};
exports.RuntimeGovernanceImpactController = RuntimeGovernanceImpactController;
__decorate([
    (0, common_1.Post)("requests/:requestId"),
    __param(0, (0, common_1.Param)("requestId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AnalyzeGovernanceImpactDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceImpactController.prototype, "analyze", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceImpactController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceImpactController.prototype, "get", null);
exports.RuntimeGovernanceImpactController = RuntimeGovernanceImpactController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/impact-analysis"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceImpactService])
], RuntimeGovernanceImpactController);
//# sourceMappingURL=runtime-governance-impact.controller.js.map