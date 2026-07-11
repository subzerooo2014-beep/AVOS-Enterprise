import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class GenerateComplianceReportDto {
  @IsOptional()
  @IsString()
  @IsIn([
    "full",
    "audit",
    "policies",
    "signatures",
    "security",
  ])
  reportType?:
    | "full"
    | "audit"
    | "policies"
    | "signatures"
    | "security";

  @IsOptional()
  @IsString()
  @MaxLength(250)
  generatedBy?: string;
}
