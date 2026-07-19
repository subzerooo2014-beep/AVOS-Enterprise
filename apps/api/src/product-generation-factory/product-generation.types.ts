export type ProductChannel = 'api' | 'web' | 'mobile' | 'agent';
export type ProductTenancy = 'single-tenant' | 'multi-tenant';

export interface ProductGenerationRequest {
  namespace: string;
  name: string;
  description: string;
  targetUsers: string[];
  channels: ProductChannel[];
  jurisdictions: string[];
  tenancy: ProductTenancy;
  features: string[];
  approvedBy: string;
}

export interface ProductSpecification {
  id: string;
  namespace: string;
  name: string;
  description: string;
  requirements: string[];
  actors: string[];
  useCases: string[];
  capabilities: string[];
  nonFunctionalRequirements: string[];
  channels: ProductChannel[];
  jurisdictions: string[];
  tenancy: ProductTenancy;
  approvedBy: string;
  createdAt: string;
}

export interface ArchitectureBlueprint {
  id: string;
  productSpecificationId: string;
  namespace: string;
  stack: {
    backend: 'NestJS';
    frontend: 'Next.js';
    mobile?: 'Flutter';
    database: 'PostgreSQL';
    orm: 'Prisma';
  };
  modules: string[];
  entities: Array<{
    name: string;
    fields: Array<{ name: string; type: string; required: boolean }>;
  }>;
  apiResources: string[];
  pages: string[];
  workflows: string[];
  capabilities: string[];
  policies: string[];
  createdAt: string;
}

export interface GeneratedProductManifest {
  id: string;
  namespace: string;
  name: string;
  outputRoot: string;
  backendFiles: string[];
  databaseFiles: string[];
  apiFiles: string[];
  frontendFiles: string[];
  testFiles: string[];
  deploymentFiles: string[];
  integrationFiles: string[];
  generatedAt: string;
}

export interface RepairResult {
  id: string;
  namespace: string;
  attempts: number;
  status: 'passed' | 'failed';
  checks: Array<{ name: string; passed: boolean; details: string }>;
  repairedFiles: string[];
  createdAt: string;
}

export interface RuntimeCertification {
  id: string;
  namespace: string;
  status: 'certified' | 'not-certified';
  score: number;
  approvedBy: string;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  checks: Array<{ name: string; passed: boolean }>;
  createdAt: string;
}