import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLedgerEntryDto {
  @IsString()
  type!: string;

  @IsString()
  title!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  referenceType?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

