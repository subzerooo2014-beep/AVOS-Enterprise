import { Type } from "class-transformer";
import {
  IsBoolean,
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class ExecuteResilienceActionDto {
  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  @IsObject()
  runtimeContext?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
