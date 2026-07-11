import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceEnvironment,
  GovernanceSnapshotScope,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceRestorePlanDto {
  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  archiveId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  checkpointId?: string;

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

  @IsEnum(GovernanceSnapshotScope)
  targetScope!: GovernanceSnapshotScope;

  @IsBoolean()
  dryRun!: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restoreSections?: string[];

  @IsIn([
    "fail",
    "overwrite",
    "merge",
    "skip_existing",
  ])
  conflictStrategy!:
    | "fail"
    | "overwrite"
    | "merge"
    | "skip_existing";

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
