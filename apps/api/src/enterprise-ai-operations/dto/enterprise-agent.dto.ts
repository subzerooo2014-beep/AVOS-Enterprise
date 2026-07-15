import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class EnterpriseAgentDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  capabilities!: string[];

  @IsBoolean()
  active!: boolean;

  @IsNumber()
  @Min(0)
  currentLoad!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  successRate!: number;
}