import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ServiceNodeDto {
  @IsString()
  id!: string;

  @IsString()
  service!: string;

  @IsString()
  region!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  health!: number;

  @IsNumber()
  @Min(0)
  latency!: number;

  @IsNumber()
  @Min(0)
  capacity!: number;
}

export class ServiceOrchestrationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceNodeDto)
  nodes!: ServiceNodeDto[];
}