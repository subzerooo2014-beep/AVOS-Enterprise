import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnterpriseKernelBridgeService } from './kernel/enterprise-kernel-bridge.service';
import { RuntimeEventBridgeService } from './events/runtime-event-bridge.service';
import { CapabilityPersistenceBridgeService } from './capabilities/capability-persistence-bridge.service';
import { RuntimeStartupValidationService } from './startup/runtime-startup-validation.service';

@Injectable()
export class RuntimeIntegrationBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(
    RuntimeIntegrationBootstrapService.name,
  );
  private initialized = false;
  private initializedAt?: string;
  private validationErrors: string[] = [];

  constructor(
    private readonly kernel: EnterpriseKernelBridgeService,
    private readonly events: RuntimeEventBridgeService,
    private readonly capabilities: CapabilityPersistenceBridgeService,
    private readonly validation: RuntimeStartupValidationService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  async initialize() {
    if (this.initialized) {
      return this.status();
    }

    const validation = await this.validation.validate();
    this.validationErrors = [...validation.errors];

    if (!validation.success) {
      throw new Error(
        `Runtime integration startup validation failed: ${validation.errors.join(', ')}`,
      );
    }

    await this.kernel.registerRuntimeFoundation();
    this.events.connect();
    await this.capabilities.synchronize();

    this.initialized = true;
    this.initializedAt = new Date().toISOString();

    this.events.publish(
      'runtime.integration.initialized',
      'runtime-integration-bootstrap',
      {
        kernelRegistrations: this.kernel.count(),
      },
    );

    this.logger.log('AVOS runtime integration initialized');

    return this.status();
  }

  status() {
    return {
      initialized: this.initialized,
      initializedAt: this.initializedAt,
      kernelRegistrations: this.kernel.count(),
      validationErrors: [...this.validationErrors],
    };
  }
}