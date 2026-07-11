import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  GovernanceEnvironment,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateRuntimeSloDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsEnum(GovernanceEnvironment)
  environment!: GovernanceEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsString()
  @MaxLength(300)
  service!: string;

  @IsString()
  @MaxLength(300)
  metric!: string;

  @IsNumber()
  target!: number;

  @IsNumber()
  warningThreshold!: number;

  @IsNumber()
  breachThreshold!: number;

  @IsInt()
  @Min(1)
  evaluationWindowMinutes!: number;

  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
