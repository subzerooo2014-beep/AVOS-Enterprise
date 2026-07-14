import { Module } from "@nestjs/common";
import { DeveloperPlatformCoreController } from "./developer-platform-core.controller";
import { DeveloperPlatformCoreService } from "./developer-platform-core.service";
import { SdkGeneratorService } from "./services/sdk-generator.service";
import { UniversalSdkService } from "./services/universal-sdk.service";
import { DeveloperCliService } from "./services/developer-cli.service";
import { ExtensionSdkService } from "./services/extension-sdk.service";
import { PluginSdkService } from "./services/plugin-sdk.service";
import { LocalDevelopmentRuntimeService } from "./services/local-development-runtime.service";
import { ApiPlaygroundService } from "./services/api-playground.service";
import { DeveloperSandboxService } from "./services/developer-sandbox.service";
import { SdkVersionManagerService } from "./services/sdk-version-manager.service";
import { SdkPackagePublisherService } from "./services/sdk-package-publisher.service";
import { SdkRegistryService } from "./services/sdk-registry.service";
import { DeveloperAuditService } from "./services/developer-audit.service";
import { DeveloperPlatformDashboardService } from "./services/developer-platform-dashboard.service";
import { SdkGeneratorRuntime } from "./runtime/sdk-generator.runtime";
import { UniversalSdkRuntime } from "./runtime/universal-sdk.runtime";
import { DeveloperCliRuntime } from "./runtime/developer-cli.runtime";
import { ExtensionSdkRuntime } from "./runtime/extension-sdk.runtime";
import { PluginSdkRuntime } from "./runtime/plugin-sdk.runtime";
import { LocalDevelopmentRuntime } from "./runtime/local-development.runtime";
import { ApiPlaygroundRuntime } from "./runtime/api-playground.runtime";
import { DeveloperSandboxRuntime } from "./runtime/developer-sandbox.runtime";

@Module({
  controllers:[DeveloperPlatformCoreController],
  providers:[
    DeveloperPlatformCoreService,
    SdkGeneratorService,UniversalSdkService,DeveloperCliService,ExtensionSdkService,PluginSdkService,
    LocalDevelopmentRuntimeService,ApiPlaygroundService,DeveloperSandboxService,SdkVersionManagerService,
    SdkPackagePublisherService,SdkRegistryService,DeveloperAuditService,DeveloperPlatformDashboardService,
    SdkGeneratorRuntime,UniversalSdkRuntime,DeveloperCliRuntime,ExtensionSdkRuntime,PluginSdkRuntime,
    LocalDevelopmentRuntime,ApiPlaygroundRuntime,DeveloperSandboxRuntime
  ],
  exports:[DeveloperPlatformCoreService],
})
export class DeveloperPlatformCoreModule {}
