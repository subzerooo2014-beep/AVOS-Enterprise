import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  GovernanceEnvironment,
  RuntimeLockType,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class AcquireRuntimeLockDto {
  @IsString()
  @MaxLength(300)
  key!: string;

  @IsEnum(RuntimeLockType)
  type!: RuntimeLockType;

  @IsOptional()
  @IsEnum(GovernanceEnvironment)
  environment?: GovernanceEnvironment;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  namespace?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  resourceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  changeExecutionId?: string;

  @IsInt()
  @Min(1)
  @Max(86400)
  ttlSeconds!: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
