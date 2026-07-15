import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class LeadDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsString()
  source!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;

  @IsIn(['new', 'qualified', 'contacted', 'converted', 'lost'])
  status!: 'new' | 'qualified' | 'contacted' | 'converted' | 'lost';
}