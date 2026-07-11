import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceEnvironment,
  GovernanceEscalationReason,
  GovernanceEscalationSeverity,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceEscalationDto {
  @IsEnum(GovernanceEscalationSeverity)
  severity!: GovernanceEscalationSeverity;

  @IsEnum(GovernanceEscalationReason)
  reason!: GovernanceEscalationReason;

  @IsString()
  @MaxLength(500)
  title!: string;

  @IsString()
  @MaxLength(8000)
  description!: string;

  @IsOptional()
  @IsEnum(GovernanceEnvironment)
  environment?: GovernanceEnvironment;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  namespace?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  service?: string;

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
  runbookExecutionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  recoveryPlanId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  isolationPlanId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  dependencyNodeId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sloEvaluationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  capacityEvaluationId?: string;

  @IsArray()
  @IsString({ each: true })
  assignedRoles!: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GovernanceActorDto)
  assignedActors?: GovernanceActorDto[];

  @IsBoolean()
  acknowledgementRequired!: boolean;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
