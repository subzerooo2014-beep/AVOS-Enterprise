import {
  IsBoolean,
  IsIn,
  IsString,
} from 'class-validator';

export class ReleaseManifestDto {
  @IsString()
  id!: string;

  @IsString()
  version!: string;

  @IsString()
  commitSha!: string;

  @IsString()
  branch!: string;

  @IsString()
  createdAt!: string;

  @IsBoolean()
  buildPassed!: boolean;

  @IsBoolean()
  typescriptPassed!: boolean;

  @IsBoolean()
  flutterAnalyzePassed!: boolean;

  @IsBoolean()
  smokePassed!: boolean;

  @IsBoolean()
  integrationPassed!: boolean;

  @IsBoolean()
  verificationPassed!: boolean;

  @IsBoolean()
  certificationPassed!: boolean;

  @IsIn(['draft', 'ready', 'released', 'rejected'])
  status!: 'draft' | 'ready' | 'released' | 'rejected';
}