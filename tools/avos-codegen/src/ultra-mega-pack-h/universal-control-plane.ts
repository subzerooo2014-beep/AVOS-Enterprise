import { randomUUID } from "node:crypto";
import { UltraHEvidence, UltraHValue } from "./contracts";

export interface ControlPlaneCommand {
  key: string;
  targetSystem: string;
  action: string;
  priority: number;
  requiresApproval: boolean;
  payload: Record<string, UltraHValue>;
}

export interface RoutedControlCommand {
  id: string;
  commandKey: string;
  targetSystem: string;
  route: string;
  status: "queued" | "approval_required" | "routed";
}

export interface UniversalControlPlaneResult {
  routedCommands: RoutedControlCommand[];
  evidence: UltraHEvidence[];
  routedAt: string;
}

export class UniversalEnterpriseControlPlane {
  route(
    systemKey: string,
    commands: readonly ControlPlaneCommand[],
  ): UniversalControlPlaneResult {
    const routedCommands = [...commands]
      .sort((a, b) => b.priority - a.priority)
      .map((command): RoutedControlCommand => ({
        id: randomUUID(),
        commandKey: command.key,
        targetSystem: command.targetSystem,
        route: `enterprise://${command.targetSystem}/${command.action}`,
        status: command.requiresApproval ? "approval_required" : "routed",
      }));

    return {
      routedCommands,
      evidence: [
        {
          id: randomUUID(),
          systemKey,
          category: "universal-enterprise-control-plane",
          action: "commands.routed",
          message: `Routed ${routedCommands.length} enterprise commands.`,
          metadata: {
            routed: routedCommands.filter((item) => item.status === "routed").length,
            approvalRequired: routedCommands.filter(
              (item) => item.status === "approval_required",
            ).length,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      routedAt: new Date().toISOString(),
    };
  }
}
