import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceRetentionStatus,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class UpdateGovernanceRetentionPolicyStatusDto {
  @IsEnum(GovernanceRetentionStatus)
  status!: GovernanceRetentionStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
