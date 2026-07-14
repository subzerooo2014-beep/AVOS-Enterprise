import {
  IsArray,
  IsIn,
  IsString,
} from 'class-validator';

export class IncidentResponseDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsIn(['low', 'medium', 'high', 'critical'])
  severity!: 'low' | 'medium' | 'high' | 'critical';

  @IsString()
  source!: string;

  @IsArray()
  @IsString({ each: true })
  affectedAssets!: string[];
}