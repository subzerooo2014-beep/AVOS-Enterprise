import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { SupplierStatus } from './procurement.enums';

export class CreateSupplierDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus;
}
