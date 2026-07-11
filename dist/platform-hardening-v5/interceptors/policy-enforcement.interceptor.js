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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyEnforcementInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const audit_event_type_enum_1 = require("../enums/audit-event-type.enum");
const audit_severity_enum_1 = require("../enums/audit-severity.enum");
const policy_decision_enum_1 = require("../enums/policy-decision.enum");
const audit_ledger_service_1 = require("../services/audit-ledger.service");
const policy_violation_registry_service_1 = require("../services/policy-violation-registry.service");
const runtime_policy_engine_service_1 = require("../services/runtime-policy-engine.service");
const request_context_service_1 = require("../../platform-hardening-v3/services/request-context.service");
let PolicyEnforcementInterceptor = class PolicyEnforcementInterceptor {
    constructor(policies, ledger, violations, context) {
        this.policies = policies;
        this.ledger = ledger;
        this.violations = violations;
        this.context = context;
    }
    intercept(executionContext, next) {
        const request = executionContext
            .switchToHttp()
            .getRequest();
        const response = executionContext
            .switchToHttp()
            .getResponse();
        const path = request.originalUrl ??
            request.url ??
            "/";
        const method = request.method ?? "UNKNOWN";
        const approvalToken = request.headers?.["x-avos-policy-approval"];
        const requestContext = this.context.get();
        const actor = request.user?.id ??
            request.user?.email ??
            request.headers?.["x-avos-actor"] ??
            "anonymous";
        const evaluation = this.policies.evaluate({
            method,
            path,
            approvalToken: typeof approvalToken === "string"
                ? approvalToken
                : undefined,
        });
        this.ledger.append({
            type: audit_event_type_enum_1.AuditEventType.POLICY_DECISION,
            severity: evaluation.decision ===
                policy_decision_enum_1.PolicyDecision.DENY
                ? audit_severity_enum_1.AuditSeverity.ERROR
                : evaluation.decision ===
                    policy_decision_enum_1.PolicyDecision.ALLOW_WITH_WARNING
                    ? audit_severity_enum_1.AuditSeverity.WARNING
                    : audit_severity_enum_1.AuditSeverity.INFO,
            action: "runtime-policy-evaluation",
            message: `Policy decision ${evaluation.decision} for ${method} ${path}`,
            actor: String(actor),
            correlationId: requestContext?.correlationId,
            traceId: requestContext?.traceId,
            method,
            path,
            metadata: {
                decision: evaluation.decision,
                riskLevel: evaluation.riskLevel,
                riskScore: evaluation.riskScore,
                matchedPolicyIds: evaluation.matchedPolicyIds,
                reasons: evaluation.reasons,
            },
        });
        if (evaluation.decision !==
            policy_decision_enum_1.PolicyDecision.ALLOW) {
            this.violations.register({
                method,
                path,
                evaluation,
                correlationId: requestContext?.correlationId,
                traceId: requestContext?.traceId,
                actor: String(actor),
            });
        }
        if (evaluation.decision ===
            policy_decision_enum_1.PolicyDecision.DENY) {
            throw new common_1.ForbiddenException({
                success: false,
                message: "Request denied by AVOS runtime security policy",
                policyDecision: evaluation.decision,
                riskLevel: evaluation.riskLevel,
                riskScore: evaluation.riskScore,
                matchedPolicyIds: evaluation.matchedPolicyIds,
                reasons: evaluation.reasons,
                correlationId: requestContext?.correlationId,
            });
        }
        const startedAt = Date.now();
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                this.ledger.append({
                    type: audit_event_type_enum_1.AuditEventType.REQUEST,
                    severity: audit_severity_enum_1.AuditSeverity.INFO,
                    action: "http-request-completed",
                    message: `${method} ${path} completed`,
                    actor: String(actor),
                    correlationId: requestContext?.correlationId,
                    traceId: requestContext?.traceId,
                    method,
                    path,
                    statusCode: Number(response.statusCode) || 200,
                    metadata: {
                        durationMs: Date.now() - startedAt,
                        policyDecision: evaluation.decision,
                    },
                });
            },
        }));
    }
};
exports.PolicyEnforcementInterceptor = PolicyEnforcementInterceptor;
exports.PolicyEnforcementInterceptor = PolicyEnforcementInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_policy_engine_service_1.RuntimePolicyEngineService,
        audit_ledger_service_1.AuditLedgerService,
        policy_violation_registry_service_1.PolicyViolationRegistryService,
        request_context_service_1.RequestContextService])
], PolicyEnforcementInterceptor);
//# sourceMappingURL=policy-enforcement.interceptor.js.map