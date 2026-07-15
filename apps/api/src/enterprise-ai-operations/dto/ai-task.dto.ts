import {
  IsArray,
  IsIn,
  IsInt,
  IsString,
  Min,
} from 'class-validator';

export class AiTaskDto {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsInt()
  @Min(0)
  priority!: number;

  @IsArray()
  @IsString({ each: true })
  requiredCapabilities!: string[];

  @IsIn(['queued', 'assigned', 'running', 'completed', 'failed'])
  status!: 'queued' | 'assigned' | 'running' | 'completed' | 'failed';
}