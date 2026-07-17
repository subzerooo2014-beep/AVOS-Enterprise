import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import type { MeshRouteKind } from "../contracts/enterprise-intelligence-mesh.contracts";

export class MeshIdentityDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsString()
  @IsNotEmpty()
  actorId!: string;

  @IsIn(["human", "agent", "service", "system"])
  actorType!: "human" | "agent" | "service" | "system";

  @IsArray()
  @IsString({ each: true })
  roles!: string[];
}

export class MeshContextDto {
  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  causationId?: string;

  @IsOptional()
  @IsString()
  traceId?: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsOptional()
  @IsIn(["low", "normal", "high", "critical"])
  priority?: "low" | "normal" | "high" | "critical";

  @ValidateNested()
  @Type(() => MeshIdentityDto)
  identity!: MeshIdentityDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ExecuteMeshRequestDto {
  @IsIn([
    "capability",
    "decision",
    "knowledge",
    "orchestration",
    "event",
    "kernel",
    "memory",
    "ai"
  ])
  route!: MeshRouteKind;

  @IsString()
  @IsNotEmpty()
  action!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => MeshContextDto)
  context!: MeshContextDto;
}

export class RegisterMeshNodeDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn([
    "capability",
    "decision",
    "knowledge",
    "orchestration",
    "event",
    "kernel",
    "memory",
    "ai"
  ])
  kind!: MeshRouteKind;

  @IsOptional()
  @IsString()
  version?: string;

  @IsArray()
  @IsString({ each: true })
  actions!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class PublishMeshEventDto {
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => MeshContextDto)
  context!: MeshContextDto;
}