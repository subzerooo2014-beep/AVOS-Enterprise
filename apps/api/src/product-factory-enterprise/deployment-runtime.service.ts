import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  DeploymentRequest,
  ProductRuntimeRecord,
} from './product-factory-enterprise.types';
import { DeploymentGateService } from './deployment-gate.service';
import { ProductFactoryEnterpriseStore } from './product-factory-enterprise.store';

@Injectable()
export class DeploymentRuntimeService {
  constructor(
    private readonly gate: DeploymentGateService,
    private readonly store: ProductFactoryEnterpriseStore,
  ) {}

  deploy(request: DeploymentRequest): ProductRuntimeRecord {
    const governance = this.gate.validate(request);

    if (!existsSync(request.packagePath)) {
      throw new BadRequestException(`Package does not exist: ${request.packagePath}`);
    }

    const now = new Date().toISOString();
    const deploymentPath = join(
      process.cwd(),
      '..',
      '..',
      '.avos',
      'product-deployments',
      request.environment,
      request.namespace,
      request.version,
    );
    mkdirSync(deploymentPath, { recursive: true });

    const record: ProductRuntimeRecord = {
      id: `product-deployment:${Date.now()}:${randomUUID().slice(0, 12)}`,
      namespace: request.namespace,
      version: request.version,
      state: 'deployed',
      environment: request.environment,
      jurisdiction: request.jurisdiction,
      packagePath: request.packagePath,
      deploymentPath,
      port: request.port ?? this.allocatePort(request.namespace),
      health: 'healthy',
      readiness: true,
      createdAt: now,
      updatedAt: now,
      governance,
    };

    this.store.runtimes.set(this.store.runtimeKey(record.namespace, record.version), record);
    this.store.deploymentHistory.push({ ...record });
    return record;
  }

  start(namespace: string, version?: string): ProductRuntimeRecord {
    return this.transition(namespace, version, 'running');
  }

  stop(namespace: string, version?: string): ProductRuntimeRecord {
    return this.transition(namespace, version, 'suspended');
  }

  restart(namespace: string, version?: string): ProductRuntimeRecord {
    const record = this.resolve(namespace, version);
    record.state = 'running';
    record.health = 'healthy';
    record.readiness = true;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  retire(namespace: string, version?: string): ProductRuntimeRecord {
    return this.transition(namespace, version, 'retired');
  }

  rollback(namespace: string): ProductRuntimeRecord {
    const history = this.store.deploymentHistory
      .filter((record) => record.namespace === namespace)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    if (history.length < 2) {
      throw new BadRequestException('No previous deployment is available for rollback.');
    }

    const previous = { ...history[1] };
    previous.id = `product-rollback:${Date.now()}:${randomUUID().slice(0, 12)}`;
    previous.state = 'rolled-back';
    previous.health = 'healthy';
    previous.readiness = true;
    previous.updatedAt = new Date().toISOString();

    this.store.runtimes.set(
      this.store.runtimeKey(previous.namespace, previous.version),
      previous,
    );
    this.store.deploymentHistory.push({ ...previous });
    return previous;
  }

  status(namespace: string, version?: string): ProductRuntimeRecord {
    return this.resolve(namespace, version);
  }

  list(): ProductRuntimeRecord[] {
    return [...this.store.runtimes.values()];
  }

  metrics() {
    const runtimes = this.list();
    return {
      total: runtimes.length,
      running: runtimes.filter((item) => item.state === 'running').length,
      deployed: runtimes.filter((item) => item.state === 'deployed').length,
      healthy: runtimes.filter((item) => item.health === 'healthy').length,
      failed: runtimes.filter((item) => item.state === 'failed').length,
      rollbacks: this.store.deploymentHistory.filter(
        (item) => item.state === 'rolled-back',
      ).length,
    };
  }

  private transition(
    namespace: string,
    version: string | undefined,
    state: ProductRuntimeRecord['state'],
  ): ProductRuntimeRecord {
    const record = this.resolve(namespace, version);
    record.state = state;
    record.health = state === 'running' ? 'healthy' : 'unknown';
    record.readiness = state === 'running';
    record.updatedAt = new Date().toISOString();
    return record;
  }

  private resolve(namespace: string, version?: string): ProductRuntimeRecord {
    const record = version
      ? this.store.runtimes.get(this.store.runtimeKey(namespace, version))
      : this.store.latest(namespace);

    if (!record) {
      throw new NotFoundException(`Product runtime not found: ${namespace}`);
    }
    return record;
  }

  private allocatePort(namespace: string): number {
    const hash = createHash('sha256').update(namespace).digest();
    return 4100 + (hash.readUInt16BE(0) % 700);
  }
}