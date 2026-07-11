import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { RuntimeControlMode } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class ChangeRuntimeControlModeDto {
  @IsEnum(RuntimeControlMode)
  controlMode!: RuntimeControlMode;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
