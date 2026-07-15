import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CustomerProfileDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  segment!: string;

  @IsNumber()
  @Min(0)
  lifetimeValue!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  engagementScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  satisfactionScore!: number;

  @IsString()
  lastActivityAt!: string;
}