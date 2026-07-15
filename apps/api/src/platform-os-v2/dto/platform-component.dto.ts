import {
  IsBoolean,
  IsIn,
  IsObject,
  IsString,
} from 'class-validator';

export class PlatformComponentDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  capability!: string;

  @IsString()
  version!: string;

  @IsBoolean()
  enabled!: boolean;

  @IsIn(['registered', 'active', 'disabled', 'failed'])
  status!: 'registered' | 'active' | 'disabled' | 'failed';

  @IsObject()
  metadata!: Record<string, string | number | boolean>;
}