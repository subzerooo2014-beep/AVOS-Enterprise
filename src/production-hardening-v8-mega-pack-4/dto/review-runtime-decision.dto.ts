import { Type } from "class-transformer";
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  RuntimeDecisionRecordStatus,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class ReviewRuntimeDecisionDto {
  @IsEnum(RuntimeDecisionRecordStatus)
  status!: RuntimeDecisionRecordStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  overrideReason?: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
