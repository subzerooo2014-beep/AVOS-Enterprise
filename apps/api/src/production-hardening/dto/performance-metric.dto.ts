import {
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class PerformanceMetricDto {
  @IsString()
  id!: string;

  @IsString()
  component!: string;

  @IsNumber()
  @Min(0)
  latencyMs!: number;

  @IsNumber()
  @Min(0)
  throughput!: number;

  @IsNumber()
  @Min(0)
  errorRate!: number;

  @IsNumber()
  @Min(0)
  cpuPercent!: number;

  @IsNumber()
  @Min(0)
  memoryMb!: number;

  @IsNumber()
  @Min(1)
  targetLatencyMs!: number;
}