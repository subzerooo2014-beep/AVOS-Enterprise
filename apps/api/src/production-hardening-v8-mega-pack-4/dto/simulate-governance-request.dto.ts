import { Type } from "class-transformer";
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { GovernanceActorDto } from "./governance-actor.dto";

export class SimulateGovernanceRequestDto {
  @IsString()
  @MaxLength(300)
  scenarioName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsObject()
  changes!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  assumptions?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
