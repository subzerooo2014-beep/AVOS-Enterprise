import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDealerDto {
  @IsString()
  name!: string;

  @IsString()
  countryCode!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}