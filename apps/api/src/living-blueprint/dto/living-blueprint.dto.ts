import {
  BlueprintEdgeType,
  BlueprintNodeStatus,
  BlueprintNodeType,
} from "../contracts/living-blueprint.contracts";

export interface RegisterBlueprintNodeDto {
  readonly key: string;
  readonly name: string;
  readonly type: BlueprintNodeType;
  readonly layer: string;
  readonly status?: BlueprintNodeStatus;
  readonly version?: string;
  readonly owner?: string;
  readonly capabilities?: readonly string[];
  readonly contracts?: readonly string[];
  readonly policies?: readonly string[];
  readonly runtime?: Readonly<Record<string, unknown>>;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface UpdateBlueprintRuntimeDto {
  readonly status?: BlueprintNodeStatus;
  readonly runtime?: Readonly<Record<string, unknown>>;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LinkBlueprintNodeDto {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: BlueprintEdgeType;
  readonly critical?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface SynchronizeBlueprintDto {
  readonly source?: "declared" | "runtime" | "synchronized";
  readonly metadata?: Readonly<Record<string, unknown>>;
}