import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceScheduleStatus,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class UpdateGovernanceScheduleStatusDto {
  @IsEnum(GovernanceScheduleStatus)
  status!: GovernanceScheduleStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
