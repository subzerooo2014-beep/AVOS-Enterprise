import { Injectable } from "@nestjs/common";
import { EnterprisePolicyService } from "./enterprise-policy.service";
import { EnterpriseApprovalService } from "./enterprise-approval.service";
import { EnterpriseExecutionHistoryService } from "./enterprise-execution-history.service";
import { EnterpriseRuntimeStateService } from "./enterprise-runtime-state.service";

@Injectable()
export class EnterpriseE2OrchestratorService {
  constructor(
    private readonly policy: EnterprisePolicyService,
    private readonly approvals: EnterpriseApprovalService,
    private readonly history: EnterpriseExecutionHistoryService,
    private readonly runtime: EnterpriseRuntimeStateService,
  ) {}

  execute(input: any) {
    const execution = this.history.start(
      input.operation,
      input.payload ?? {},
    );

    const policy = this.policy.evaluate(input.policy ?? {});

    if (!policy.allowed) {
      return {
        success: false,
        policy,
        execution: this.history.fail(execution.id, policy.reason),
      };
    }

    const approval = this.approvals.request({
      subject: input.operation,
      requestedBy: input.requestedBy,
    });

    const approved = this.approvals.decide(
      approval.id,
      "APPROVED",
      "AVOS-E2-AUTO",
      "policy-approved",
    );

    const runtime = this.runtime.set(input.operation, {
      lastExecutionId: execution.id,
      approvalId: approved.id,
      status: "COMPLETED",
    });

    const completed = this.history.complete(execution.id, {
      approvalId: approved.id,
      runtimeKey: input.operation,
    });

    return {
      success: true,
      policy,
      approval: approved,
      runtime,
      execution: completed,
    };
  }

  status() {
    return {
      success: true,
      system: "AVOS Enterprise Mega Bundle E2",
      status: "running",
      capabilities: 4,
      approvals: this.approvals.list().length,
      executions: this.history.list().length,
      runtimeEntries: this.runtime.list().length,
    };
  }
}
