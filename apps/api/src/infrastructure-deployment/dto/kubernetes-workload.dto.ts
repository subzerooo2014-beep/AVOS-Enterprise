import {
  IsBoolean,
  IsInt,
  IsString,
  Min,
} from 'class-validator';

export class KubernetesWorkloadDto {
  @IsString()
  id!: string;

  @IsInt()
  @Min(1)
  replicas!: number;

  @IsBoolean()
  readinessProbe!: boolean;

  @IsBoolean()
  livenessProbe!: boolean;

  @IsBoolean()
  resourceRequests!: boolean;

  @IsBoolean()
  resourceLimits!: boolean;

  @IsBoolean()
  podDisruptionBudget!: boolean;
}