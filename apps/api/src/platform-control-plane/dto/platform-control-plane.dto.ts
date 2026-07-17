import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString
} from "class-validator";
import type {
  PlatformEnvironmentKind,
  PlatformResourceKind,
  PlatformResourceStatus
} from "../contracts/platform-control-plane.contracts";

export class CreatePlatformEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(["development", "testing", "staging", "production"])
  kind!: PlatformEnvironmentKind;

  @IsString()
  @IsNotEmpty()
  region!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class RegisterPlatformResourceDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn([
    "platform",
    "product",
    "application",
    "service",
    "engine",
    "capability",
    "workflow",
    "integration"
  ])
  kind!: PlatformResourceKind;

  @IsOptional()
  @IsString()
  version?: string;

  @IsString()
  @IsNotEmpty()
  environmentId!: string;

  @IsOptional()
  @IsIn([
    "registered",
    "starting",
    "running",
    "degraded",
    "stopped",
    "failed",
    "maintenance"
  ])
  status?: PlatformResourceStatus;

  @IsString()
  @IsNotEmpty()
  owner!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  endpoints?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdatePlatformResourceStatusDto {
  @IsIn([
    "registered",
    "starting",
    "running",
    "degraded",
    "stopped",
    "failed",
    "maintenance"
  ])
  status!: PlatformResourceStatus;

  @IsString()
  @IsNotEmpty()
  actorId!: string;
}

export class SetPlatformConfigurationDto {
  @IsString()
  @IsNotEmpty()
  namespace!: string;

  @IsString()
  @IsNotEmpty()
  key!: string;

  value!: unknown;

  @IsString()
  @IsNotEmpty()
  environmentId!: string;

  @IsOptional()
  @IsBoolean()
  sensitive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  updatedBy!: string;
}