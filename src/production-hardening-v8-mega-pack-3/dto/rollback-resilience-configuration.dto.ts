import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { RuntimeActorDto } from "./runtime-actor.dto";

export class RollbackResilienceConfigurationDto {
  @IsString()
  @MaxLength(4000)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  targetConfigurationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  baselineId?: string;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
