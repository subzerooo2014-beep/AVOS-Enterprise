import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class GenerateEvidencePackageDto {
  @IsOptional()
  @IsString()
  @IsIn([
    "full_governance",
    "audit_evidence",
    "policy_evidence",
    "integrity_evidence",
  ])
  packageType?:
    | "full_governance"
    | "audit_evidence"
    | "policy_evidence"
    | "integrity_evidence";

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  generatedBy?: string;
}
