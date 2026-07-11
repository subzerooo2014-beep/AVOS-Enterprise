import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceControlMode,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class ChangeGovernanceControlModeDto {
  @IsEnum(GovernanceControlMode)
  controlMode!: GovernanceControlMode;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
