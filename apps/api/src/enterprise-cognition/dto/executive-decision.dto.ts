import { IsArray, IsString } from 'class-validator';

export class ExecutiveDecisionDto {
  @IsString()
  objective!: string;

  @IsArray()
  @IsString({ each: true })
  options!: string[];
}