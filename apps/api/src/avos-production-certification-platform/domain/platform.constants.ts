import { EvidenceDomain } from './certification.types';

export const REQUIRED_EVIDENCE_DOMAINS: EvidenceDomain[] = [
  'database',
  'environment',
  'observability',
  'backup-recovery',
  'security',
  'performance',
  'integration',
  'deployment',
];

export const PLATFORM_NAME = 'AVOS Production & Certification Platform';
export const PLATFORM_VERSION = 'APCP-1.0.0';
export const CERTIFICATION_THRESHOLD = 100;
