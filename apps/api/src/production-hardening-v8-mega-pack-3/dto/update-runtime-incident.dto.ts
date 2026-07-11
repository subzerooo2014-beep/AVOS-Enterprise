import { Type } from "class-transformer";
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { RuntimeIncidentStatus } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class UpdateRuntimeIncidentDto {
  @IsEnum(RuntimeIncidentStatus)
  status!: RuntimeIncidentStatus;

  @IsString()
  @MaxLength(8000)
  message!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
