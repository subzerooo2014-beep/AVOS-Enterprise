import {
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class ExecuteRemediationDto {
  @IsOptional()
  @IsString()
  actor?: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}
