import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IdentityContextDto {
  @IsString()
  userId!: string;

  @IsString()
  organizationId!: string;

  @IsArray()
  @IsString({ each: true })
  roles!: string[];

  @IsNumber()
  @Min(0)
  @Max(100)
  authenticationStrength!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  sessionRisk!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  locationRisk!: number;

  @IsString()
  verifiedAt!: string;
}

export class DeviceContextDto {
  @IsString()
  deviceId!: string;

  @IsBoolean()
  managed!: boolean;

  @IsBoolean()
  encrypted!: boolean;

  @IsBoolean()
  osPatched!: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  malwareScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  complianceScore!: number;
}

export class EvaluateAccessDto {
  @IsString()
  id!: string;

  @ValidateNested()
  @Type(() => IdentityContextDto)
  identity!: IdentityContextDto;

  @ValidateNested()
  @Type(() => DeviceContextDto)
  device!: DeviceContextDto;

  @IsString()
  resource!: string;

  @IsString()
  action!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  sensitivity!: number;
}