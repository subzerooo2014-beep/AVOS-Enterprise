import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateSloDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  indicator!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  targetPercentage!: number;

  @IsInt()
  @Min(1)
  @Max(365)
  windowDays!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  warningThresholdPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  criticalThresholdPercentage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  owner?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  tags?: string[];
}

export class RecordSloSignalDto {
  @IsInt()
  @Min(0)
  successfulEvents!: number;

  @IsInt()
  @Min(1)
  totalEvents!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  latencyP95Ms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  errorCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  impactMinutes?: number;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  source!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsISO8601()
  observedAt?: string;
}

export class CreateResilienceIncidentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsIn(["low", "medium", "high", "critical"])
  severity!: "low" | "medium" | "high" | "critical";

  @IsOptional()
  @IsNumber()
  @Min(0)
  impactMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  customerImpact?: string;

  @IsOptional()
  @IsISO8601()
  startedAt?: string;
}

export class ResolveResilienceIncidentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(3000)
  rootCause!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(3000)
  remediation!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  impactMinutes?: number;
}

export class EvaluateReleaseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  version!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  environment!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  requestedBy?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  changeRiskScore!: number;

  @IsBoolean()
  rollbackReady!: boolean;

  @IsBoolean()
  monitoringReady!: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  testCoveragePercentage!: number;

  @IsBoolean()
  securityVerified!: boolean;

  @IsBoolean()
  evidenceVerified!: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateContinuityPlanDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  owner?: string;

  @IsInt()
  @Min(1)
  recoveryTimeObjectiveMinutes!: number;

  @IsInt()
  @Min(0)
  recoveryPointObjectiveMinutes!: number;

  @IsInt()
  @Min(1)
  maximumTolerableDowntimeMinutes!: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  dependencies?: string[];

  @IsArray()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  recoverySteps!: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  communicationSteps?: string[];

  @IsOptional()
  @IsISO8601()
  nextTestDueAt?: string;
}

export class TestContinuityPlanDto {
  @IsNumber()
  @Min(0)
  observedRecoveryMinutes!: number;

  @IsBoolean()
  evidenceVerified!: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  findings?: string[];
}

export class CreateChaosDrillDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(3000)
  scenario!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(3000)
  expectedOutcome!: string;

  @IsOptional()
  @IsISO8601()
  plannedAt?: string;
}

export class CompleteChaosDrillDto {
  @IsIn(["passed", "failed"])
  status!: "passed" | "failed";

  @IsNumber()
  @Min(0)
  observedRecoveryMinutes!: number;

  @IsBoolean()
  evidenceVerified!: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  findings?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  remediationActions?: string[];
}
