import {
  IsIn,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ConnectorRegistrationDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  system!: string;

  @IsString()
  protocol!: string;

  @IsString()
  region!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  trustScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  healthScore!: number;

  @IsNumber()
  @Min(0)
  latencyMs!: number;

  @IsIn(['registered', 'active', 'degraded', 'suspended', 'retired'])
  status!:
    | 'registered'
    | 'active'
    | 'degraded'
    | 'suspended'
    | 'retired';
}