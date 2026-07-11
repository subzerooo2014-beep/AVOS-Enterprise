import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { ResilienceActionType } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class CreateResilienceActionDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  incidentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  configurationId?: string;

  @IsEnum(ResilienceActionType)
  type!: ResilienceActionType;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsString()
  @MaxLength(1000)
  target!: string;

  @IsObject()
  parameters!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  idempotencyKey?: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
