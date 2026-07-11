import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus, SalesStatus } from '../constants/sales.enums';

export class SalesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SalesStatus)
  quoteStatus?: SalesStatus;

  @IsOptional()
  @IsEnum(ContractStatus)
  contractStatus?: ContractStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
