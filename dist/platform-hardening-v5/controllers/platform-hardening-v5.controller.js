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
exports.PlatformHardeningV5Controller = void 0;
const common_1 = require("@nestjs/common");
const policy_enforcement_mode_enum_1 = require("../enums/policy-enforcement-mode.enum");
const v5_diagnostics_token_guard_1 = require("../guards/v5-diagnostics-token.guard");
const audit_ledger_service_1 = require("../services/audit-ledger.service");
const platform_hardening_v5_service_1 = require("../services/platform-hardening-v5.service");
const policy_violation_registry_service_1 = require("../services/policy-violation-registry.service");
const runtime_policy_engine_service_1 = require("../services/runtime-policy-engine.service");
let PlatformHardeningV5Controller = class PlatformHardeningV5Controller {
    constructor(hardening, ledger, policies, violations) {
        this.hardening = hardening;
        this.ledger = ledger;
        this.policies = policies;
        this.violations = violations;
    }
    getStatus() {
        return this.hardening.getStatus();
    }
    getSnapshot() {
        return this.hardening.getSnapshot();
    }
    getAudit(limit) {
        return {
            success: true,
            summary: this.ledger.getSummary(),
            events: this.ledger.findAll({
                limit: Number(limit) || 100,
            }),
        };
    }
    verifyAuditIntegrity() {
        return {
            success: true,
            integrity: this.ledger.verifyIntegrity(),
        };
    }
    getAuditEvent(id) {
        const event = this.ledger.findOne(id);
        if (!event) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Audit event ${id} was not found`,
            });
        }
        return {
            success: true,
            event,
        };
    }
    getPolicies() {
        return {
            success: true,
            enforcementMode: this.policies.getMode(),
            policies: this.policies.findAll(),
        };
    }
    setAuditOnlyMode() {
        return {
            success: true,
            enforcementMode: this.policies.setMode(policy_enforcement_mode_enum_1.PolicyEnforcementMode.AUDIT_ONLY),
        };
    }
    setEnforceMode() {
        return {
            success: true,
            enforcementMode: this.policies.setMode(policy_enforcement_mode_enum_1.PolicyEnforcementMode.ENFORCE),
        };
    }
    enablePolicy(id) {
        const policy = this.policies.setEnabled(id, true);
        if (!policy) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Policy ${id} was not found`,
            });
        }
        return {
            success: true,
            policy,
        };
    }
    disablePolicy(id) {
        const policy = this.policies.setEnabled(id, false);
        if (!policy) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Policy ${id} was not found`,
            });
        }
        return {
            success: true,
            policy,
        };
    }
    getViolations(limit) {
        return {
            success: true,
            summary: this.violations.getSummary(),
            violations: this.violations.findAll(Number(limit) || 100),
        };
    }
};
exports.PlatformHardeningV5Controller = PlatformHardeningV5Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("audit"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "getAudit", null);
__decorate([
    (0, common_1.Get)("audit/integrity"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "verifyAuditIntegrity", null);
__decorate([
    (0, common_1.Get)("audit/:id"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "getAuditEvent", null);
__decorate([
    (0, common_1.Get)("policies"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "getPolicies", null);
__decorate([
    (0, common_1.Post)("policies/mode/audit-only"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "setAuditOnlyMode", null);
__decorate([
    (0, common_1.Post)("policies/mode/enforce"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "setEnforceMode", null);
__decorate([
    (0, common_1.Post)("policies/:id/enable"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "enablePolicy", null);
__decorate([
    (0, common_1.Post)("policies/:id/disable"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "disablePolicy", null);
__decorate([
    (0, common_1.Get)("violations"),
    (0, common_1.UseGuards)(v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV5Controller.prototype, "getViolations", null);
exports.PlatformHardeningV5Controller = PlatformHardeningV5Controller = __decorate([
    (0, common_1.Controller)("platform-hardening/v5"),
    __metadata("design:paramtypes", [platform_hardening_v5_service_1.PlatformHardeningV5Service,
        audit_ledger_service_1.AuditLedgerService,
        runtime_policy_engine_service_1.RuntimePolicyEngineService,
        policy_violation_registry_service_1.PolicyViolationRegistryService])
], PlatformHardeningV5Controller);
//# sourceMappingURL=platform-hardening-v5.controller.js.map