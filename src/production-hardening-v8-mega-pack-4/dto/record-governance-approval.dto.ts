import { Type } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceApprovalStatus,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class RecordGovernanceApprovalDto {
  @IsEnum(GovernanceApprovalStatus)
  status!: GovernanceApprovalStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
