import {
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
  DependencyRelationshipType,
} from "../contracts";

export class CreateDependencyEdgeDto {
  @IsString()
  @MaxLength(200)
  sourceNodeId!: string;

  @IsString()
  @MaxLength(200)
  targetNodeId!: string;

  @IsEnum(DependencyRelationshipType)
  relationshipType!: DependencyRelationshipType;

  @IsInt()
  @Min(0)
  @Max(100)
  criticality!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  timeoutMilliseconds?: number;

  @IsBoolean()
  retryEnabled!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  fallbackNodeId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
