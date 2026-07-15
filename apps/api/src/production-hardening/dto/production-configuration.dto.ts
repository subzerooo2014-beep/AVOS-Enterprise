import {
  IsBoolean,
  IsString,
} from 'class-validator';

export class ProductionConfigurationDto {
  @IsString()
  environment!: string;

  @IsBoolean()
  httpsEnabled!: boolean;

  @IsBoolean()
  corsRestricted!: boolean;

  @IsBoolean()
  rateLimitingEnabled!: boolean;

  @IsBoolean()
  secretsExternalized!: boolean;

  @IsBoolean()
  databaseTlsEnabled!: boolean;

  @IsBoolean()
  cacheEnabled!: boolean;

  @IsBoolean()
  queueEnabled!: boolean;
}