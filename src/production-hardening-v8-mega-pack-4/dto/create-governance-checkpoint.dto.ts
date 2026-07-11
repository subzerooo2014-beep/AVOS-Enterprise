import { Type } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceCheckpointType,
  GovernanceEnvironment,
  GovernanceSnapshotScope,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceCheckpointDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsEnum(GovernanceCheckpointType)
  type!: GovernanceCheckpointType;

  @IsEnum(GovernanceSnapshotScope)
  scope!: GovernanceSnapshotScope;

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
  @MaxLength(200)
  governanceRequestId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  changeExecutionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  recoveryPlanId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  previousCheckpointId?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
