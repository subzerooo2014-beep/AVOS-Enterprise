import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  GovernanceNotificationChannel,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class GovernanceNotificationRecipientDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  name?: string;

  @IsString()
  @MaxLength(1000)
  address!: string;

  @IsEnum(GovernanceNotificationChannel)
  channel!: GovernanceNotificationChannel;

  @IsArray()
  @IsString({ each: true })
  roles!: string[];
}

export class CreateGovernanceNotificationDto {
  @IsEnum(GovernanceNotificationChannel)
  channel!: GovernanceNotificationChannel;

  @IsString()
  @MaxLength(500)
  subject!: string;

  @IsString()
  @MaxLength(12000)
  message!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GovernanceNotificationRecipientDto)
  recipients!: GovernanceNotificationRecipientDto[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  escalationId?: string;

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
  @IsString()
  @MaxLength(200)
  scheduleRunId?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  priority!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deduplicationKey?: string;

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
