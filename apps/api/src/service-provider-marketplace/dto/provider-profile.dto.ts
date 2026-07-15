import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ProviderProfileDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsIn(['workshop', 'mobile-service', 'inspection-center', 'specialist'])
  type!: 'workshop' | 'mobile-service' | 'inspection-center' | 'specialist';

  @IsString()
  city!: string;

  @IsString()
  region!: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating!: number;

  @IsBoolean()
  verified!: boolean;

  @IsArray()
  @IsString({ each: true })
  capabilities!: string[];
}