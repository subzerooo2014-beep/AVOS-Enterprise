import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FederationNodeDto {
  @IsString()
  id!: string;

  @IsString()
  organization!: string;

  @IsString()
  region!: string;

  @IsString()
  identityProvider!: string;

  @IsString()
  policyVersion!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  trustScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  healthScore!: number;
}

export class FederationManagementDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FederationNodeDto)
  nodes!: FederationNodeDto[];
}