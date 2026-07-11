import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class PublishPlatformEventDto {
  @IsString()
  eventType!: string;

  @IsString()
  source!: string;

  @IsIn([
    "informational",
    "low",
    "medium",
    "high",
    "critical",
  ])
  severity!:
    | "informational"
    | "low"
    | "medium"
    | "high"
    | "critical";

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  causationId?: string;
}
