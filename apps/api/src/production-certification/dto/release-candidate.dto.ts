import {
  IsBoolean,
  IsIn,
  IsString,
} from 'class-validator';

export class ReleaseCandidateDto {
  @IsString()
  id!: string;

  @IsString()
  version!: string;

  @IsString()
  commitSha!: string;

  @IsBoolean()
  buildPassed!: boolean;

  @IsBoolean()
  testsPassed!: boolean;

  @IsBoolean()
  securityPassed!: boolean;

  @IsBoolean()
  performancePassed!: boolean;

  @IsBoolean()
  compliancePassed!: boolean;

  @IsIn(['draft', 'certified', 'rejected'])
  status!: 'draft' | 'certified' | 'rejected';
}