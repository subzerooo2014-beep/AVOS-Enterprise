import {
  IsArray,
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
  DependencyHealthStatus,
  DependencyNodeType,
  GovernanceEnvironment,
} from "../contracts";

export class CreateDependencyNodeDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsEnum(DependencyNodeType)
  type!: DependencyNodeType;

  @IsEnum(GovernanceEnvironment)
  environment!: GovernanceEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  service?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  criticality!: number;

  @IsOptional()
  @IsEnum(DependencyHealthStatus)
  healthStatus?: DependencyHealthStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  healthScore?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  zone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  owner?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
