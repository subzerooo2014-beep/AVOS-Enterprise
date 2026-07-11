import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class RunIntegrityScanDto {
  @IsOptional()
  @IsString()
  @IsIn(["all", "audit", "policies"])
  scope?: "all" | "audit" | "policies";

  @IsOptional()
  @IsString()
  @MaxLength(250)
  executedBy?: string;
}
