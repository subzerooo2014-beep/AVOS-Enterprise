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
exports.RuntimeAutonomousApprovalController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
let RuntimeAutonomousApprovalController = class RuntimeAutonomousApprovalController {
    constructor(approvals, requests) {
        this.approvals = approvals;
        this.requests = requests;
    }
    generate(requestId, runtimeContext) {
        const request = this.requests.get(requestId);
        return this.approvals.generate(request, runtimeContext ?? {});
    }
    list() {
        return this.approvals.list();
    }
};
exports.RuntimeAutonomousApprovalController = RuntimeAutonomousApprovalController;
__decorate([
    (0, common_1.Post)("requests/:requestId"),
    __param(0, (0, common_1.Param)("requestId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousApprovalController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousApprovalController.prototype, "list", null);
exports.RuntimeAutonomousApprovalController = RuntimeAutonomousApprovalController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/approval-suggestions"),
    __metadata("design:paramtypes", [services_1.RuntimeAutonomousApprovalService,
        services_1.RuntimeGovernanceRequestService])
], RuntimeAutonomousApprovalController);
//# sourceMappingURL=runtime-autonomous-approval.controller.js.map