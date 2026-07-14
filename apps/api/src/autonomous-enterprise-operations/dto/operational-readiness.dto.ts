import { IsArray, IsNumber, IsString, Max, Min } from 'class-validator';

export class OperationalSignalDto {
  @IsString()
  id!: string;

  @IsString()
  domain!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  health!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  capacity!: number;

  @IsNumber()
  @Min(0)
  latency!: number;

  @IsString()
  observedAt!: string;
}

export class OperationalReadinessDto {
  @IsArray()
  signals!: OperationalSignalDto[];
}