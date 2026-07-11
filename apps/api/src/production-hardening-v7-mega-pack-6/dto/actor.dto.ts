import {
  IsOptional,
  IsString,
} from "class-validator";

export class ActorDto {
  @IsOptional()
  @IsString()
  actor?: string;
}
