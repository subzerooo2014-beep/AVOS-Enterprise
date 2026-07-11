import { Type } from "class-transformer";
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  RuntimeChangeType,
  RuntimeEnvironment,
} from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class EvaluateRuntimeRiskDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  configurationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  policyId?: string;

  @IsEnum(RuntimeEnvironment)
  environment!: RuntimeEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsEnum(RuntimeChangeType)
  changeType!: RuntimeChangeType;

  @IsObject()
  context!: Record<string, unknown>;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
