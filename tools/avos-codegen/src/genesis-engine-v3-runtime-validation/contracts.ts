export type GenesisV3RuntimePrimitive =
  | string
  | number
  | boolean
  | null;

export type GenesisV3RuntimeValue =
  | GenesisV3RuntimePrimitive
  | GenesisV3RuntimeValue[]
  | { [key: string]: GenesisV3RuntimeValue };

export enum GenesisV3RuntimeStageStatus {
  PASSED = "passed",
  FAILED = "failed",
  SKIPPED = "skipped",
}

export enum GenesisV3RuntimeStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface GenesisV3RuntimeCommand {
  key: string;
  command: string;
  required: boolean;
  timeoutMs: number;
  weight: number;
}

export interface GenesisV3RuntimeCommandResult {
  key: string;
  command: string;
  required: boolean;
  status: GenesisV3RuntimeStageStatus;
  exitCode: number | null;
  durationMs: number;
  output: string;
  score: number;
}

export interface GenesisV3RuntimeEvidence {
  id: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, GenesisV3RuntimeValue>;
  createdAt: string;
}
