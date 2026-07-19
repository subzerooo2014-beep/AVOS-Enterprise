import { Module } from "@nestjs/common";
import { FactoryRuntimeModule } from "../runtime/runtime.module";
import { FactoryBootstrapService } from "./factory-bootstrap.service";
import { FactoryCapabilitiesService } from "./factory-capabilities.service";
import { FactoryHealthService } from "./factory-health.service";
import { FactoryLifecycleService } from "./factory-lifecycle.service";
import { FactoryVersionService } from "./factory-version.service";

@Module({
  imports: [FactoryRuntimeModule],
  providers: [
    FactoryBootstrapService,
    FactoryCapabilitiesService,
    FactoryHealthService,
    FactoryLifecycleService,
    FactoryVersionService,
  ],
  exports: [
    FactoryBootstrapService,
    FactoryCapabilitiesService,
    FactoryHealthService,
    FactoryLifecycleService,
    FactoryVersionService,
  ],
})
export class FactoryKernelModule {}
