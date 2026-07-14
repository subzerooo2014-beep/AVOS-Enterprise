import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AutonomousGoalDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  owner!: string;

  @IsNumber()
  @Min(0)
  priority!: number;

  @IsNumber()
  targetValue!: number;

  @IsNumber()
  currentValue!: number;

  @IsString()
  dueDate!: string;

  @IsArray()
  @IsString({ each: true })
  dependencies!: string[];
}

export class GoalManagementDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutonomousGoalDto)
  goals!: AutonomousGoalDto[];
}