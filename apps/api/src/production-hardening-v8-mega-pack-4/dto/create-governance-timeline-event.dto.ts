import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceTimelineEventType,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceTimelineEventDto {
  @IsString()
  @MaxLength(300)
  aggregateType!: string;

  @IsString()
  @MaxLength(300)
  aggregateId!: string;

  @IsEnum(GovernanceTimelineEventType)
  type!: GovernanceTimelineEventType;

  @IsString()
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedResourceIds?: string[];

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
