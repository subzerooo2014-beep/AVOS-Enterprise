import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
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
  RuntimeChangeType,
  RuntimeControlMode,
  RuntimeEnvironment,
} from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class CreateResilienceConfigurationDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsString()
  @MaxLength(300)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsEnum(RuntimeEnvironment)
  environment!: RuntimeEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsEnum(RuntimeControlMode)
  controlMode!: RuntimeControlMode;

  @IsEnum(RuntimeChangeType)
  changeType!: RuntimeChangeType;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  minimumApprovals?: number;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
