import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import {
  DependencyHealthStatus,
} from "../contracts";

export class UpdateDependencyHealthDto {
  @IsEnum(DependencyHealthStatus)
  healthStatus!: DependencyHealthStatus;

  @IsInt()
  @Min(0)
  @Max(100)
  healthScore!: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
