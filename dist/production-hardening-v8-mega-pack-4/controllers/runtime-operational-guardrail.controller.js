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
exports.RuntimeOperationalGuardrailController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeOperationalGuardrailController = class RuntimeOperationalGuardrailController {
    constructor(guardrails, requests) {
        this.guardrails = guardrails;
        this.requests = requests;
    }
    create(dto) {
        return this.guardrails.create(dto);
    }
    list() {
        return this.guardrails.list();
    }
    listEvaluations() {
        return this.guardrails
            .listEvaluations();
    }
    get(id) {
        return this.guardrails.get(id);
    }
    updateStatus(id, dto) {
        return this.guardrails
            .updateStatus(id, dto);
    }
    evaluateRequest(requestId, runtimeContext) {
        const request = this.requests.get(requestId);
        return this.guardrails
            .evaluateRequest(request, runtimeContext ?? {});
    }
};
exports.RuntimeOperationalGuardrailController = RuntimeOperationalGuardrailController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRuntimeGuardrailDto]),
    __metadata("design:returntype", void 0)
], RuntimeOperationalGuardrailController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeOperationalGuardrailController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeOperationalGuardrailController.prototype, "listEvaluations", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeOperationalGuardrailController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRuntimeGuardrailStatusDto]),
    __metadata("design:returntype", void 0)
], RuntimeOperationalGuardrailController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)("requests/:requestId/evaluate"),
    __param(0, (0, common_1.Param)("requestId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RuntimeOperationalGuardrailController.prototype, "evaluateRequest", null);
exports.RuntimeOperationalGuardrailController = RuntimeOperationalGuardrailController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/guardrails"),
    __metadata("design:paramtypes", [services_1.RuntimeOperationalGuardrailService,
        services_1.RuntimeGovernanceRequestService])
], RuntimeOperationalGuardrailController);
//# sourceMappingURL=runtime-operational-guardrail.controller.js.map