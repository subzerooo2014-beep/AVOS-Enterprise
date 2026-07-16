import { Injectable, NotFoundException } from "@nestjs/common";
import { UnifiedCommandOrchestratorV2Service } from "./unified-command-orchestrator-v2.service";
import type { CommandApprovalV2 } from "./unified-command-v2.types";

@Injectable()
export class CommandApprovalV2Service {
  private readonly approvals = new Map<string, CommandApprovalV2>();

  constructor(
    private readonly commands: UnifiedCommandOrchestratorV2Service,
  ) {}

  request(commandId: string, approver: string): CommandApprovalV2 {
    this.commands.get(commandId);

    const approval: CommandApprovalV2 = {
      id: `command-approval-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      commandId,
      approver,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.approvals.set(approval.id, approval);
    return { ...approval };
  }

  approve(id: string, reason?: string): CommandApprovalV2 {
    const approval = this.requireApproval(id);
    approval.status = "APPROVED";
    approval.reason = reason;
    approval.decidedAt = new Date().toISOString();

    this.commands.markApproved(approval.commandId);

    return { ...approval };
  }

  reject(id: string, reason?: string): CommandApprovalV2 {
    const approval = this.requireApproval(id);
    approval.status = "REJECTED";
    approval.reason = reason;
    approval.decidedAt = new Date().toISOString();

    return { ...approval };
  }

  list(): CommandApprovalV2[] {
    return Array.from(this.approvals.values()).map((approval) => ({
      ...approval,
    }));
  }

  pendingCount(): number {
    return this.list().filter((approval) => approval.status === "PENDING")
      .length;
  }

  private requireApproval(id: string): CommandApprovalV2 {
    const approval = this.approvals.get(id);

    if (!approval) {
      throw new NotFoundException(`Command approval '${id}' was not found.`);
    }

    return approval;
  }
}
