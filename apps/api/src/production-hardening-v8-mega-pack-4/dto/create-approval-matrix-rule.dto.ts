import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import {
  GovernanceApprovalTier,
  GovernanceEnvironment,
  GovernanceRequestType,
  GovernanceRiskLevel,
} from "../contracts";

export class CreateApprovalMatrixRuleDto {
  @IsString()
  @MaxLength(300)
  name!: string;

  @IsOptional()
  @IsEnum(GovernanceEnvironment)
  environment?: GovernanceEnvironment;

  @IsArray()
  @IsEnum(GovernanceRequestType, { each: true })
  requestTypes!: GovernanceRequestType[];

  @IsEnum(GovernanceRiskLevel)
  minimumRiskLevel!: GovernanceRiskLevel;

  @IsEnum(GovernanceRiskLevel)
  maximumRiskLevel!: GovernanceRiskLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minimumBlastRadius?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minimumBusinessCriticality?: number;

  @IsBoolean()
  rollbackPlanRequired!: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minimumTestCoverage?: number;

  @IsEnum(GovernanceApprovalTier)
  tier!: GovernanceApprovalTier;

  @IsInt()
  @Min(0)
  @Max(20)
  requiredApprovals!: number;

  @IsArray()
  @IsString({ each: true })
  requiredRoles!: string[];

  @IsBoolean()
  enabled!: boolean;

  @IsInt()
  @Min(0)
  priority!: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
