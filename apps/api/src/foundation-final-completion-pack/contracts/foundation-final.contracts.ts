export type FoundationDomain =
  | 'interoperability'
  | 'localization'
  | 'responsible-ai'
  | 'continuity'
  | 'configuration';

export type FoundationStatus = 'healthy' | 'degraded' | 'blocked';

export interface FoundationCheck {
  key: string;
  passed: boolean;
  message: string;
}

export interface FoundationDomainReport {
  domain: FoundationDomain;
  status: FoundationStatus;
  score: number;
  checks: FoundationCheck[];
  generatedAt: string;
}

export interface FoundationFinalReport {
  system: 'AVOS Foundation Final Completion';
  version: '1.0.0';
  status: FoundationStatus;
  score: number;
  humanFinalAuthority: true;
  foundationFirst: true;
  domains: FoundationDomainReport[];
  generatedAt: string;
}
