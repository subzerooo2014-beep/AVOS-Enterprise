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
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateMaintenanceModeDto {
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

  @IsISO8601()
  startsAt!: string;

  @IsOptional()
  @IsISO8601()
  endsAt?: string;

  @IsArray()
  @IsString({ each: true })
  affectedServices!: string[];

  @IsBoolean()
  allowReadOperations!: boolean;

  @IsBoolean()
  allowWriteOperations!: boolean;

  @IsBoolean()
  allowBackgroundJobs!: boolean;

  @IsBoolean()
  allowDeployments!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  publicMessage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  internalMessage?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
