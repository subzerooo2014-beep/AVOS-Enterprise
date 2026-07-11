import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GuardrailStatus,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class UpdateRuntimeGuardrailStatusDto {
  @IsEnum(GuardrailStatus)
  status!: GuardrailStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
