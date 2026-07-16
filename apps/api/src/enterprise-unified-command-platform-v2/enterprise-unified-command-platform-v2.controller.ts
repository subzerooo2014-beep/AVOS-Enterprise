import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommandApprovalV2Service } from "./command-approval-v2.service";
import { CommandSourceRegistryV2Service } from "./command-source-registry-v2.service";
import { EnterpriseUnifiedCommandPlatformV2Service } from "./enterprise-unified-command-platform-v2.service";
import { ExecutiveCockpitV2Service } from "./executive-cockpit-v2.service";
import { GlobalMonitoringV2Service } from "./global-monitoring-v2.service";
import { UnifiedCommandOrchestratorV2Service } from "./unified-command-orchestrator-v2.service";
import type {
  CommandSignalV2,
  CommandSourceV2,
  ExecutiveMetricV2,
} from "./unified-command-v2.types";

@Controller("enterprise-unified-command-platform-v2")
export class EnterpriseUnifiedCommandPlatformV2Controller {
  constructor(
    private readonly platform: EnterpriseUnifiedCommandPlatformV2Service,
    private readonly sources: CommandSourceRegistryV2Service,
    private readonly commands: UnifiedCommandOrchestratorV2Service,
    private readonly approvals: CommandApprovalV2Service,
    private readonly monitoring: GlobalMonitoringV2Service,
    private readonly cockpit: ExecutiveCockpitV2Service,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("dashboard")
  dashboard() {
    return this.platform.dashboard();
  }

  @Post("sources")
  registerSource(
    @Body() body: Omit<CommandSourceV2, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      source: this.sources.register(body),
    };
  }

  @Post("commands")
  createCommand(
    @Body()
    body: {
      sourceId: string;
      commandType: string;
      target: string;
      priority: number;
      payload: Record<string, unknown>;
      approvalRequired: boolean;
      approver?: string;
    },
  ) {
    const command = this.commands.create(
      body.sourceId,
      body.commandType,
      body.target,
      body.priority,
      body.payload,
      body.approvalRequired,
    );

    const approval =
      body.approvalRequired && body.approver
        ? this.approvals.request(command.id, body.approver)
        : undefined;

    return {
      success: true,
      command,
      approval,
    };
  }

  @Post("approvals/:id/approve")
  approve(
    @Param("id") id: string,
    @Body() body: { reason?: string },
  ) {
    return {
      success: true,
      approval: this.approvals.approve(id, body.reason),
    };
  }

  @Post("commands/:id/execute")
  execute(@Param("id") id: string) {
    return {
      success: true,
      command: this.commands.execute(id),
    };
  }

  @Post("signals")
  ingestSignal(
    @Body()
    body: {
      sourceId: string;
      category: string;
      severity: CommandSignalV2["severity"];
      message: string;
      data?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      signal: this.monitoring.ingest(
        body.sourceId,
        body.category,
        body.severity,
        body.message,
        body.data,
      ),
    };
  }

  @Post("executive-metrics")
  updateExecutiveMetric(
    @Body()
    body: Omit<ExecutiveMetricV2, "updatedAt">,
  ) {
    return {
      success: true,
      metric: this.cockpit.update(
        body.id,
        body.name,
        body.value,
        body.unit,
        body.trend,
        body.target,
      ),
    };
  }
}
