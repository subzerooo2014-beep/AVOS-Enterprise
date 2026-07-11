import { Type } from "class-transformer";
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceEscalationStatus,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class UpdateGovernanceEscalationDto {
  @IsEnum(GovernanceEscalationStatus)
  status!: GovernanceEscalationStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  resolution?: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
