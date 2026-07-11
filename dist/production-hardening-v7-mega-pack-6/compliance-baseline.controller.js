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
exports.ComplianceBaselineController = void 0;
const common_1 = require("@nestjs/common");
const compliance_baseline_service_1 = require("./compliance-baseline.service");
const compare_baseline_dto_1 = require("./dto/compare-baseline.dto");
const create_compliance_baseline_dto_1 = require("./dto/create-compliance-baseline.dto");
let ComplianceBaselineController = class ComplianceBaselineController {
    constructor(baselines) {
        this.baselines = baselines;
    }
    create(dto) {
        return this.baselines.create(dto);
    }
    list(status) {
        return this.baselines.list(status);
    }
    listComparisons(baselineId) {
        return this.baselines.listComparisons(baselineId);
    }
    get(id) {
        return this.baselines.get(id);
    }
    updateStatus(id, dto) {
        return this.baselines.updateStatus(id, dto.status, dto.actor ?? "api");
    }
    compare(id, dto) {
        return this.baselines.compare(id, dto);
    }
};
exports.ComplianceBaselineController = ComplianceBaselineController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_compliance_baseline_dto_1.CreateComplianceBaselineDto]),
    __metadata("design:returntype", void 0)
], ComplianceBaselineController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceBaselineController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("comparisons"),
    __param(0, (0, common_1.Query)("baselineId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceBaselineController.prototype, "listComparisons", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceBaselineController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ComplianceBaselineController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(":id/compare"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, compare_baseline_dto_1.CompareBaselineDto]),
    __metadata("design:returntype", void 0)
], ComplianceBaselineController.prototype, "compare", null);
exports.ComplianceBaselineController = ComplianceBaselineController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/baselines"),
    __metadata("design:paramtypes", [compliance_baseline_service_1.ComplianceBaselineService])
], ComplianceBaselineController);
//# sourceMappingURL=compliance-baseline.controller.js.map