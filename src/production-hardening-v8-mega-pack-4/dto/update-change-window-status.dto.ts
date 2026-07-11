import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { ChangeWindowStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class UpdateChangeWindowStatusDto {
  @IsEnum(ChangeWindowStatus)
  status!: ChangeWindowStatus;

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
