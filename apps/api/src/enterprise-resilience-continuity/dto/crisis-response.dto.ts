import {
  IsArray,
  IsIn,
  IsString,
} from 'class-validator';

export class CrisisResponseDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  domain!: string;

  @IsIn(['low', 'medium', 'high', 'critical'])
  severity!: 'low' | 'medium' | 'high' | 'critical';

  @IsArray()
  @IsString({ each: true })
  affectedDependencies!: string[];
}