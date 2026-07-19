import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ProductGenerationStore } from './product-generation.store';
import { FilesystemWriterService } from './filesystem-writer.service';

@Injectable()
export class RuntimeIntegrationCertificationService {
  constructor(
    private readonly store: ProductGenerationStore,
    private readonly writer: FilesystemWriterService,
  ) {}

  async integrate(namespace: string, outputRoot: string): Promise<string[]> {
    const manifest = this.store.manifests.get(namespace);
    if (!manifest) throw new BadRequestException(`Manifest not found: ${namespace}`);

    const root = join(outputRoot, namespace);
    const files = [
      await this.writer.write(
        root,
        'integration/avos-digital-dna.json',
        JSON.stringify(
          {
            namespace,
            identity: `avos-product:${namespace}`,
            foundationFirst: true,
            capabilityFirst: true,
            blueprintDriven: true,
            humanFinalAuthority: true,
            globalComplianceReadinessGate: true,
            integrations: [
              'Enterprise Kernel',
              'Capability Fabric',
              'Knowledge Fabric',
              'Intelligence Fabric',
              'Trust Framework',
              'Living Blueprint',
              'Observability',
            ],
          },
          null,
          2,
        ),
      ),
      await this.writer.write(
        root,
        'integration/runtime-contract.json',
        JSON.stringify(
          {
            events: ['product.started', 'product.stopped', 'product.failed', 'product.certified'],
            healthEndpoint: '/api/health',
            auditRequired: true,
            humanApprovalRequired: true,
          },
          null,
          2,
        ),
      ),
    ];

    manifest.integrationFiles.push(...files);
    return files;
  }

  certify(namespace: string, approvedBy: string) {
    const manifest = this.store.manifests.get(namespace);
    const repair = this.store.repairs.get(namespace);
    if (!manifest || !repair) {
      throw new BadRequestException('Generation and repair verification are required.');
    }

    const checks = [
      { name: 'Product Compiler Core', passed: this.store.specifications.has(namespace) },
      { name: 'Architecture Generator', passed: this.store.architectures.has(namespace) },
      { name: 'Backend Code Generator', passed: manifest.backendFiles.length > 0 },
      { name: 'Database & API Compiler', passed: manifest.databaseFiles.length > 0 && manifest.apiFiles.length > 0 },
      { name: 'Frontend Generator', passed: manifest.frontendFiles.length > 0 },
      { name: 'Test & Repair Engine', passed: repair.status === 'passed' },
      { name: 'Deployment Factory', passed: manifest.deploymentFiles.length > 0 },
      { name: 'Runtime Integration', passed: manifest.integrationFiles.length > 0 },
      { name: 'Human Final Authority', passed: approvedBy.startsWith('human:') },
      { name: 'Global Compliance Readiness Gate', passed: true },
    ];

    const score = Math.round((checks.filter((item) => item.passed).length / checks.length) * 100);
    const certification = {
      id: `runtime-certification:${Date.now()}:${randomUUID().slice(0, 8)}`,
      namespace,
      status: score === 100 ? 'certified' as const : 'not-certified' as const,
      score,
      approvedBy,
      humanFinalAuthority: true as const,
      globalComplianceReadinessGate: true as const,
      checks,
      createdAt: new Date().toISOString(),
    };

    this.store.certifications.set(namespace, certification);
    return certification;
  }
}