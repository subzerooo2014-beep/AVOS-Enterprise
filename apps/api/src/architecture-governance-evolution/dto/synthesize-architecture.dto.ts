import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SynthesizeArchitectureDto {
  @IsString()
  objective!: string;

  @IsArray()
  targetCapabilities!: string[];

  @IsNumber()
  @Min(0)
  @Max(100)
  currentFitness!: number;

  @IsOptional()
  @IsArray()
  constraints?: string[];
}