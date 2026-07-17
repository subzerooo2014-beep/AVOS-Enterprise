import { Injectable } from '@nestjs/common';
import { RuntimePolicyService } from '../governance/runtime-policy.service';
import { HumanApprovalService } from '../governance/human-approval.service';
import { RuntimeWorkflowService } from './runtime-workflow.service';
import { RuntimeAuditService } from '../governance/runtime-audit.service';

@Injectable()
export class EnterpriseOrchestratorService {
  constructor(
    private readonly policy: RuntimePolicyService,
    private readonly approvals: HumanApprovalService,
    private readonly workflows: RuntimeWorkflowService,
    private readonly audit: RuntimeAuditService,
  ) {}

  async execute(input: {
    workflow: string;
    action: string;
    subject: string;
    actor: string;
    risk: 'low' | 'medium' | 'high' | 'critical';
    permissions: string[];
    context: Record<string, unknown>;
  }) {
    const decision = this.policy.evaluate({
      action: input.action,
      subject: input.subject,
      risk: input.risk,
      permissions: input.permissions,
    });

    this.audit.record({
      action: 'orchestration.policy-evaluated',
      actor: input.actor,
      subject: input.subject,
      payload: { decision },
    });

    if (decision.outcome === 'deny') {
      return {
        success: false,
        stage: 'policy',
        decision,
      };
    }

    if (decision.outcome === 'review') {
      const approval = this.approvals.request({
        action: input.action,
        subject: input.subject,
        requestedBy: input.actor,
        risk: input.risk,
      });

      return {
        success: false,
        stage: 'approval',
        decision,
        approval,
      };
    }

    const execution = await this.workflows.execute(
      input.workflow,
      input.context,
    );

    this.audit.record({
      action: 'orchestration.workflow-executed',
      actor: input.actor,
      subject: input.subject,
      payload: { execution },
    });

    return {
      success: execution.status === 'completed',
      stage: 'workflow',
      decision,
      execution,
    };
  }
}