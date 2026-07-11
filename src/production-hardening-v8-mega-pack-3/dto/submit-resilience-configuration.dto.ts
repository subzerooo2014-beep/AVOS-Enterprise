import { Type } from "class-transformer";
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class SubmitResilienceConfigurationDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  reason?: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
