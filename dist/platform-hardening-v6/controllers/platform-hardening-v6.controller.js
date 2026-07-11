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
exports.PlatformHardeningV6Controller = void 0;
const common_1 = require("@nestjs/common");
const create_persistent_audit_event_dto_1 = require("../dto/create-persistent-audit-event.dto");
const persistent_audit_ledger_service_1 = require("../services/persistent-audit-ledger.service");
const platform_hardening_v6_service_1 = require("../services/platform-hardening-v6.service");
const v6_diagnostics_token_guard_1 = require("../services/v6-diagnostics-token.guard");
let PlatformHardeningV6Controller = class PlatformHardeningV6Controller {
    constructor(hardening, audit) {
        this.hardening = hardening;
        this.audit = audit;
    }
    getStatus() {
        return this.hardening.getStatus();
    }
    getSnapshot() {
        return this.hardening.getSnapshot();
    }
    async getAudit(limit, eventType, severity, actor, correlationId) {
        return {
            success: true,
            summary: await this.audit.getSummary(),
            events: await this.audit.findMany({
                limit: Number(limit) || 100,
                eventType,
                severity,
                actor,
                correlationId,
            }),
        };
    }
    async verifyIntegrity() {
        return {
            success: true,
            integrity: await this.audit.verifyIntegrity(),
        };
    }
    async getBySequence(sequence) {
        return {
            success: true,
            event: await this.audit.findBySequence(sequence),
        };
    }
    async getById(id) {
        return {
            success: true,
            event: await this.audit.findOne(id),
        };
    }
    async append(dto) {
        return {
            success: true,
            event: await this.audit.append(dto),
        };
    }
};
exports.PlatformHardeningV6Controller = PlatformHardeningV6Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV6Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV6Controller.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("audit"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("eventType")),
    __param(2, (0, common_1.Query)("severity")),
    __param(3, (0, common_1.Query)("actor")),
    __param(4, (0, common_1.Query)("correlationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PlatformHardeningV6Controller.prototype, "getAudit", null);
__decorate([
    (0, common_1.Get)("audit/integrity"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformHardeningV6Controller.prototype, "verifyIntegrity", null);
__decorate([
    (0, common_1.Get)("audit/sequence/:sequence"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("sequence", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlatformHardeningV6Controller.prototype, "getBySequence", null);
__decorate([
    (0, common_1.Get)("audit/:id"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformHardeningV6Controller.prototype, "getById", null);
__decorate([
    (0, common_1.Post)("audit"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_persistent_audit_event_dto_1.CreatePersistentAuditEventDto]),
    __metadata("design:returntype", Promise)
], PlatformHardeningV6Controller.prototype, "append", null);
exports.PlatformHardeningV6Controller = PlatformHardeningV6Controller = __decorate([
    (0, common_1.Controller)("platform-hardening/v6"),
    __metadata("design:paramtypes", [platform_hardening_v6_service_1.PlatformHardeningV6Service,
        persistent_audit_ledger_service_1.PersistentAuditLedgerService])
], PlatformHardeningV6Controller);
//# sourceMappingURL=platform-hardening-v6.controller.js.map