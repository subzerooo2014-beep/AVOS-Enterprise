import { Type } from "class-transformer";
import {
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { GovernanceActorDto } from "./governance-actor.dto";

export class AnalyzeGovernanceImpactDto {
  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
