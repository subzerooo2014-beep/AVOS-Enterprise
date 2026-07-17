import { Injectable } from '@nestjs/common';
import { CapabilityRegistryService } from '../capabilities/capability-registry.service';
import { DependencyGraphService } from '../capabilities/dependency-graph.service';
import { RuntimeAuditService } from '../governance/runtime-audit.service';

@Injectable()
export class RuntimeDiagnosticsService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly dependencies: DependencyGraphService,
    private readonly audit: RuntimeAuditService,
  ) {}

  run() {
    const capabilities = this.registry.list();
    const dependencyValidation =
      this.dependencies.validate(capabilities);

    return {
      success:
        dependencyValidation.valid && this.audit.verifyChain(),
      generatedAt: new Date().toISOString(),
      capabilityCount: capabilities.length,
      dependencyValidation,
      auditChainValid: this.audit.verifyChain(),
      failedCapabilities: capabilities
        .filter((item) => item.state === 'failed')
        .map((item) => item.id),
    };
  }
}