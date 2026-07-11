import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuditLedgerService } from "../services/audit-ledger.service";
import { PolicyViolationRegistryService } from "../services/policy-violation-registry.service";
import { RuntimePolicyEngineService } from "../services/runtime-policy-engine.service";
import { RequestContextService } from "../../platform-hardening-v3/services/request-context.service";
export declare class PolicyEnforcementInterceptor implements NestInterceptor {
    private readonly policies;
    private readonly ledger;
    private readonly violations;
    private readonly context;
    constructor(policies: RuntimePolicyEngineService, ledger: AuditLedgerService, violations: PolicyViolationRegistryService, context: RequestContextService);
    intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown>;
}
