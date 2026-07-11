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
exports.RuntimeDecisionCenterController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeDecisionCenterController = class RuntimeDecisionCenterController {
    constructor(decisions) {
        this.decisions = decisions;
    }
    generate(requestId, runtimeContext) {
        return this.decisions.generate(requestId, runtimeContext ?? {});
    }
    list() {
        return this.decisions.list();
    }
    get(id) {
        return this.decisions.get(id);
    }
    review(id, dto) {
        return this.decisions.review(id, dto);
    }
    execute(id) {
        return this.decisions
            .markExecuted(id);
    }
    snapshot() {
        return this.decisions
            .snapshot();
    }
};
exports.RuntimeDecisionCenterController = RuntimeDecisionCenterController;
__decorate([
    (0, common_1.Post)("requests/:requestId/generate"),
    __param(0, (0, common_1.Param)("requestId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RuntimeDecisionCenterController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)("decisions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeDecisionCenterController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("decisions/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeDecisionCenterController.prototype, "get", null);
__decorate([
    (0, common_1.Post)("decisions/:id/review"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ReviewRuntimeDecisionDto]),
    __metadata("design:returntype", void 0)
], RuntimeDecisionCenterController.prototype, "review", null);
__decorate([
    (0, common_1.Post)("decisions/:id/execute"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeDecisionCenterController.prototype, "execute", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeDecisionCenterController.prototype, "snapshot", null);
exports.RuntimeDecisionCenterController = RuntimeDecisionCenterController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/decision-center"),
    __metadata("design:paramtypes", [services_1.RuntimeDecisionCenterService])
], RuntimeDecisionCenterController);
//# sourceMappingURL=runtime-decision-center.controller.js.map