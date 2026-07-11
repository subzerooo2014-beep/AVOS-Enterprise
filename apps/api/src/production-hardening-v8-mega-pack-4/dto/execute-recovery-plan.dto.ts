import { Type } from "class-transformer";
import {
  IsBoolean,
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { GovernanceActorDto } from "./governance-actor.dto";

export class ExecuteRecoveryPlanDto {
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
