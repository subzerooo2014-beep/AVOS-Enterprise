import { IsArray, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class ArchitectureSignalDto {
  @IsString()
  id!: string;

  @IsString()
  source!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  value!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence!: number;

  @IsString()
  observedAt!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string | number | boolean>;
}

export class EvaluateArchitectureDto {
  @IsArray()
  signals!: ArchitectureSignalDto[];

  @IsOptional()
  @IsArray()
  constraints?: string[];
}