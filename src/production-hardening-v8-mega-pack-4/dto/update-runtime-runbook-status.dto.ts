import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  RuntimeRunbookStatus,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class UpdateRuntimeRunbookStatusDto {
  @IsEnum(RuntimeRunbookStatus)
  status!: RuntimeRunbookStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
