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
import { RuntimeEnvironment } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class CaptureRuntimeBaselineDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsEnum(RuntimeEnvironment)
  environment!: RuntimeEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  configurationIds?: string[];

  @IsOptional()
  @IsObject()
  signalSnapshot?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
