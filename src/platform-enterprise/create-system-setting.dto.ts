import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSystemSettingDto {
  @IsString()
  key!: string;

  @IsString()
  value!: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
