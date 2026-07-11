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
exports.ApprovalWorkflowController = void 0;
const common_1 = require("@nestjs/common");
const approval_workflow_service_1 = require("./approval-workflow.service");
const approval_vote_dto_1 = require("./dto/approval-vote.dto");
const create_approval_request_dto_1 = require("./dto/create-approval-request.dto");
let ApprovalWorkflowController = class ApprovalWorkflowController {
    constructor(approvals) {
        this.approvals = approvals;
    }
    create(dto) {
        return this.approvals.create(dto);
    }
    list(decision) {
        return this.approvals.list(decision);
    }
    get(id) {
        return this.approvals.get(id);
    }
    vote(id, dto) {
        return this.approvals.vote(id, dto);
    }
    cancel(id, actor) {
        return this.approvals.cancel(id, actor);
    }
    expirePending() {
        return this.approvals
            .expirePendingRequests();
    }
};
exports.ApprovalWorkflowController = ApprovalWorkflowController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_approval_request_dto_1.CreateApprovalRequestDto]),
    __metadata("design:returntype", void 0)
], ApprovalWorkflowController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("decision")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApprovalWorkflowController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApprovalWorkflowController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/vote"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_vote_dto_1.ApprovalVoteDto]),
    __metadata("design:returntype", void 0)
], ApprovalWorkflowController.prototype, "vote", null);
__decorate([
    (0, common_1.Patch)(":id/cancel/:actor"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("actor")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApprovalWorkflowController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)("maintenance/expire"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApprovalWorkflowController.prototype, "expirePending", null);
exports.ApprovalWorkflowController = ApprovalWorkflowController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/approvals"),
    __metadata("design:paramtypes", [approval_workflow_service_1.ApprovalWorkflowService])
], ApprovalWorkflowController);
//# sourceMappingURL=approval-workflow.controller.js.map