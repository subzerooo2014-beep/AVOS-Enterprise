import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RegisterPlatformDto {
  @IsString()
  @IsNotEmpty()
  platformId!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsString()
  @IsNotEmpty()
  version!: string;

  @IsString()
  @IsNotEmpty()
  owner!: string;

  @IsIn(['local', 'http', 'event'])
  adapterType!: 'local' | 'http' | 'event';
}
