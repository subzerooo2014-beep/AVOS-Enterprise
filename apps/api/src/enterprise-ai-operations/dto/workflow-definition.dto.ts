import {
  IsArray,
  IsIn,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkflowStepDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsIn(['task', 'decision', 'approval', 'agent', 'event'])
  type!: 'task' | 'decision' | 'approval' | 'agent' | 'event';

  @IsArray()
  @IsString({ each: true })
  dependsOn!: string[];

  @IsInt()
  @Min(1)
  timeoutSeconds!: number;
}

export class WorkflowDefinitionDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  version!: number;

  @IsIn(['draft', 'active', 'paused', 'completed', 'failed', 'cancelled'])
  status!: 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowStepDto)
  steps!: WorkflowStepDto[];

  @IsArray()
  @IsString({ each: true })
  triggers!: string[];
}