import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { AuditEventType } from "../enums/audit-event-type.enum";
import { AuditSeverity } from "../enums/audit-severity.enum";
import { PolicyDecision } from "../enums/policy-decision.enum";
import { AuditLedgerService } from "../services/audit-ledger.service";
import { PolicyViolationRegistryService } from "../services/policy-violation-registry.service";
import { RuntimePolicyEngineService } from "../services/runtime-policy-engine.service";
import { RequestContextService } from "../../platform-hardening-v3/services/request-context.service";

@Injectable()
export class PolicyEnforcementInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly policies:
      RuntimePolicyEngineService,
    private readonly ledger:
      AuditLedgerService,
    private readonly violations:
      PolicyViolationRegistryService,
    private readonly context:
      RequestContextService,
  ) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request =
      executionContext
        .switchToHttp()
        .getRequest<any>();

    const response =
      executionContext
        .switchToHttp()
        .getResponse<any>();

    const path =
      request.originalUrl ??
      request.url ??
      "/";

    const method =
      request.method ?? "UNKNOWN";

    const approvalToken =
      request.headers?.[
        "x-avos-policy-approval"
      ];

    const requestContext =
      this.context.get();

    const actor =
      request.user?.id ??
      request.user?.email ??
      request.headers?.[
        "x-avos-actor"
      ] ??
      "anonymous";

    const evaluation =
      this.policies.evaluate({
        method,
        path,
        approvalToken:
          typeof approvalToken === "string"
            ? approvalToken
            : undefined,
      });

    this.ledger.append({
      type:
        AuditEventType.POLICY_DECISION,
      severity:
        evaluation.decision ===
        PolicyDecision.DENY
          ? AuditSeverity.ERROR
          : evaluation.decision ===
              PolicyDecision.ALLOW_WITH_WARNING
            ? AuditSeverity.WARNING
            : AuditSeverity.INFO,
      action:
        "runtime-policy-evaluation",
      message:
        `Policy decision ${evaluation.decision} for ${method} ${path}`,
      actor: String(actor),
      correlationId:
        requestContext?.correlationId,
      traceId:
        requestContext?.traceId,
      method,
      path,
      metadata: {
        decision:
          evaluation.decision,
        riskLevel:
          evaluation.riskLevel,
        riskScore:
          evaluation.riskScore,
        matchedPolicyIds:
          evaluation.matchedPolicyIds,
        reasons:
          evaluation.reasons,
      },
    });

    if (
      evaluation.decision !==
      PolicyDecision.ALLOW
    ) {
      this.violations.register({
        method,
        path,
        evaluation,
        correlationId:
          requestContext?.correlationId,
        traceId:
          requestContext?.traceId,
        actor: String(actor),
      });
    }

    if (
      evaluation.decision ===
      PolicyDecision.DENY
    ) {
      throw new ForbiddenException({
        success: false,
        message:
          "Request denied by AVOS runtime security policy",
        policyDecision:
          evaluation.decision,
        riskLevel:
          evaluation.riskLevel,
        riskScore:
          evaluation.riskScore,
        matchedPolicyIds:
          evaluation.matchedPolicyIds,
        reasons:
          evaluation.reasons,
        correlationId:
          requestContext?.correlationId,
      });
    }

    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.ledger.append({
            type:
              AuditEventType.REQUEST,
            severity:
              AuditSeverity.INFO,
            action:
              "http-request-completed",
            message:
              `${method} ${path} completed`,
            actor: String(actor),
            correlationId:
              requestContext?.correlationId,
            traceId:
              requestContext?.traceId,
            method,
            path,
            statusCode:
              Number(
                response.statusCode,
              ) || 200,
            metadata: {
              durationMs:
                Date.now() - startedAt,
              policyDecision:
                evaluation.decision,
            },
          });
        },
      }),
    );
  }
}
