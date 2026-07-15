import {
  IsIn,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class OpportunityDto {
  @IsString()
  id!: string;

  @IsString()
  customerId!: string;

  @IsString()
  title!: string;

  @IsNumber()
  @Min(0)
  value!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability!: number;

  @IsIn(['discovery', 'proposal', 'negotiation', 'won', 'lost'])
  stage!: 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
}