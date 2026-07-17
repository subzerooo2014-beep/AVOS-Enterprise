import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min
} from "class-validator";

export class ExecuteLifecycleCommandDto {
  @IsIn([
    "start",
    "stop",
    "restart",
    "enter-maintenance",
    "exit-maintenance",
    "recover",
    "diagnose"
  ])
  command!:
    | "start"
    | "stop"
    | "restart"
    | "enter-maintenance"
    | "exit-maintenance"
    | "recover"
    | "diagnose";

  @IsString()
  @IsNotEmpty()
  actorId!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class RecordHeartbeatDto {
  @IsIn(["healthy", "degraded", "unhealthy"])
  status!: "healthy" | "degraded" | "unhealthy";

  @IsInt()
  @Min(0)
  latencyMs!: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}

export class RecordServiceFailureDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsIn(["warning", "error", "critical"])
  severity!: "warning" | "error" | "critical";

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}