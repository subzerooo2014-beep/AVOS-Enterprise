import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseKernelMegaPack3Service } from "./enterprise-kernel-mega-pack-3.service";
import { KernelPrincipalRegistryService } from "./authorization/kernel-principal-registry.service";
import { KernelPermissionRegistryService } from "./permissions/kernel-permission-registry.service";
import { KernelPolicyRegistryService } from "./policies/kernel-policy-registry.service";
import { KernelAuthorizationService } from "./authorization/kernel-authorization.service";
import { KernelApprovalService } from "./approvals/kernel-approval.service";
import { KernelTrustIntegrationService } from "./trust/kernel-trust-integration.service";
import { KernelGovernanceIntegrationService } from "./governance/kernel-governance-integration.service";
import { KernelControlledExecutionService } from "./execution/kernel-controlled-execution.service";
import { KernelSecurityHealthService } from "./health/kernel-security-health.service";
import { KernelSecurityAuditService } from "./observability/kernel-security-audit.service";
import {
  KernelGovernanceBinding,
  KernelPermission,
  KernelPolicy,
  KernelSecurityPrincipal
} from "./enterprise-kernel-mega-pack-3.types";

@Controller("enterprise-kernel-v3")
export class EnterpriseKernelMegaPack3Controller {
  constructor(
    private readonly pack: EnterpriseKernelMegaPack3Service,
    private readonly principals: KernelPrincipalRegistryService,
    private readonly permissions: KernelPermissionRegistryService,
    private readonly policies: KernelPolicyRegistryService,
    private readonly authorization: KernelAuthorizationService,
    private readonly approvals: KernelApprovalService,
    private readonly trust: KernelTrustIntegrationService,
    private readonly governance: KernelGovernanceIntegrationService,
    private readonly executions: KernelControlledExecutionService,
    private readonly health: KernelSecurityHealthService,
    private readonly audit: KernelSecurityAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("principals")
  principalList() {
    return {
      summary: this.principals.summary(),
      items: this.principals.list()
    };
  }

  @Post("principals")
  registerPrincipal(
    @Body()
    body: {
      principal: Omit<
        KernelSecurityPrincipal,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.principals.register(
      body.principal,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("permissions")
  permissionList() {
    return {
      summary: this.permissions.summary(),
      items: this.permissions.list()
    };
  }

  @Post("permissions")
  registerPermission(
    @Body()
    body: {
      permission: Omit<
        KernelPermission,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.permissions.register(
      body.permission,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("policies")
  policyList() {
    return {
      summary: this.policies.summary(),
      items: this.policies.list()
    };
  }

  @Post("policies")
  registerPolicy(
    @Body()
    body: {
      policy: Omit<
        KernelPolicy,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.policies.register(
      body.policy,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("authorization/decide")
  authorize(
    @Body()
    body: {
      principalId: string;
      resource: string;
      action: string;
      risk: "low" | "medium" | "high" | "critical";
      context?: Record<string, unknown>;
      correlationId: string;
    }
  ) {
    return this.authorization.authorize(body);
  }

  @Get("authorization/decisions")
  authorizationDecisions() {
    return {
      summary: this.authorization.summary(),
      items: this.authorization.listDecisions()
    };
  }

  @Get("approvals")
  approvalList() {
    return {
      summary: this.approvals.summary(),
      items: this.approvals.list()
    };
  }

  @Post("approvals/:id/decide")
  decideApproval(
    @Param("id") id: string,
    @Body()
    body: {
      approverIdentityId: string;
      approve: boolean;
      reason: string;
      correlationId: string;
    }
  ) {
    return this.approvals.decide({
      approvalId: id,
      ...body
    });
  }

  @Post("trust/assess")
  assessTrust(
    @Body()
    body: {
      principalId: string;
      resource: string;
      action: string;
      risk: "low" | "medium" | "high" | "critical";
      correlationId: string;
    }
  ) {
    return this.trust.assess(body);
  }

  @Get("governance/bindings")
  governanceBindings() {
    return {
      summary: this.governance.summary(),
      items: this.governance.list()
    };
  }

  @Post("governance/bindings")
  registerGovernanceBinding(
    @Body()
    body: {
      binding: Omit<
        KernelGovernanceBinding,
        "createdAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.governance.register(
      body.binding,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("executions")
  requestExecution(
    @Body()
    body: {
      principalId: string;
      resource: string;
      action: string;
      risk: "low" | "medium" | "high" | "critical";
      reversible: boolean;
      payload: Record<string, unknown>;
      compensationPayload?: Record<string, unknown>;
      correlationId: string;
    }
  ) {
    return this.executions.request(body);
  }

  @Get("executions")
  executionList() {
    return {
      summary: this.executions.summary(),
      items: this.executions.list()
    };
  }

  @Post("executions/:id/run")
  runExecution(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.executions.execute({
      executionId: id,
      ...body
    });
  }

  @Post("executions/:id/compensate")
  compensateExecution(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    return this.executions.compensate({
      executionId: id,
      ...body
    });
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
