import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class LoadTestResultDto {
  @IsString()
  id!: string;

  @IsString()
  scenario!: string;

  @IsInt()
  @Min(1)
  virtualUsers!: number;

  @IsInt()
  @Min(1)
  requests!: number;

  @IsNumber()
  @Min(0)
  errorRate!: number;

  @IsNumber()
  @Min(0)
  p95LatencyMs!: number;

  @IsNumber()
  @Min(0)
  throughputPerSecond!: number;

  @IsBoolean()
  passed!: boolean;
}