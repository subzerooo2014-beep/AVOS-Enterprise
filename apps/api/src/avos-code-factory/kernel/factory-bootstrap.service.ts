import { Injectable, OnModuleInit } from "@nestjs/common";
import { FactoryCapabilitiesService } from "./factory-capabilities.service";
import { FactoryLifecycleService } from "./factory-lifecycle.service";
import { FACTORY_VERSION } from "../constants/factory.constants";

@Injectable()
export class FactoryBootstrapService implements OnModuleInit {
  constructor(
    private readonly lifecycle: FactoryLifecycleService,
    private readonly capabilities: FactoryCapabilitiesService,
  ) {}

  onModuleInit(): void {
    this.bootstrap();
  }

  bootstrap() {
    const current = this.lifecycle.current();
    if (current === "ready" || current === "running") {
      return this.status();
    }

    this.lifecycle.transition("bootstrapping", "NestJS module initialization");

    this.capabilities.register({
      id: "factory-kernel",
      name: "Factory Kernel",
      version: FACTORY_VERSION,
      category: "kernel",
      enabled: true,
      dependencies: [],
      metadata: { critical: true },
    });

    this.capabilities.register({
      id: "factory-runtime",
      name: "Factory Runtime",
      version: FACTORY_VERSION,
      category: "runtime",
      enabled: true,
      dependencies: ["factory-kernel"],
      metadata: { critical: true },
    });

    this.lifecycle.transition("ready", "Factory kernel bootstrapped");
    return this.status();
  }

  status() {
    return {
      state: this.lifecycle.current(),
      capabilities: this.capabilities.summary(),
      bootstrapped: ["ready", "running", "degraded"].includes(this.lifecycle.current()),
    };
  }
}
