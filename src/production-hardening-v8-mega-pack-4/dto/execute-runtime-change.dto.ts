import { Type } from "class-transformer";
import {
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { GovernanceActorDto } from "./governance-actor.dto";

export class ExecuteRuntimeChangeDto {
  @IsOptional()
  @IsObject()
  runtimeContext?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
