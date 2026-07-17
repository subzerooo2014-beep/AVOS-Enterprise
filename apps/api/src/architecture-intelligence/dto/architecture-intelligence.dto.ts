import {
  ArchitectureComponentType,
  ArchitectureStatus,
} from "../contracts/architecture-intelligence.contracts";

export interface RegisterArchitectureComponentDto {
  readonly key: string;
  readonly name: string;
  readonly type: ArchitectureComponentType;
  readonly layer: string;
  readonly version?: string;
  readonly status?: ArchitectureStatus;
  readonly owner?: string;
  readonly dependencies?: readonly string[];
  readonly capabilities?: readonly string[];
  readonly contracts?: readonly string[];
  readonly policies?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface ProposeArchitectureChangeDto {
  readonly componentId: string;
  readonly changeType: "upgrade" | "replace" | "remove" | "add-dependency" | "remove-dependency";
  readonly description: string;
  readonly proposedVersion?: string;
  readonly targetComponentId?: string;
  readonly requestedBy?: string;
}

export interface ArchitectureApprovalDto {
  readonly approved: boolean;
  readonly approvedBy: string;
  readonly reason?: string;
}