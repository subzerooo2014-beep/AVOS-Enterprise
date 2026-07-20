import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { EvidenceDomain } from '../domain/certification.types';

const domains: EvidenceDomain[] = [
  'database',
  'environment',
  'observability',
  'backup-recovery',
  'security',
  'performance',
  'integration',
  'deployment',
];

export class CollectEvidenceDto {
  @IsString()
  platformId!: string;

  @IsOptional()
  @IsArray()
  @IsIn(domains, { each: true })
  domains?: EvidenceDomain[];
}
