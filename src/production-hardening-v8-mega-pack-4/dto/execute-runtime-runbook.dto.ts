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

export class ExecuteRuntimeRunbookDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  governanceRequestId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  decisionRecordId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  changeExecutionId?: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @IsOptional()
  @IsObject()
  runtimeContext?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
