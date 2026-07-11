import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  RuntimeEnvironment,
  RuntimeIncidentSeverity,
  RuntimeRiskLevel,
} from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class CreateRuntimeIncidentDto {
  @IsString()
  @MaxLength(500)
  title!: string;

  @IsString()
  @MaxLength(8000)
  description!: string;

  @IsEnum(RuntimeEnvironment)
  environment!: RuntimeEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  service?: string;

  @IsEnum(RuntimeIncidentSeverity)
  severity!: RuntimeIncidentSeverity;

  @IsEnum(RuntimeRiskLevel)
  riskLevel!: RuntimeRiskLevel;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  signalIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  configurationIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
