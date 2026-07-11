import { Type } from "class-transformer";
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateRuntimeChangeExecutionDto {
  @IsString()
  @MaxLength(200)
  governanceRequestId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  decisionRecordId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  recoveryPlanId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  isolationPlanId?: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
