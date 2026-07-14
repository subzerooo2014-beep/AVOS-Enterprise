import { Body, Controller, Get, Post } from "@nestjs/common";
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
import { DeveloperPlatformDashboardService } from "./services/developer-platform-dashboard.service";

@Controller("developer-platform-core")
export class DeveloperPlatformCoreController {
  constructor(
    private readonly os: DeveloperPlatformCoreService,
    private readonly sdk: SdkGeneratorService,
    private readonly universal: UniversalSdkService,
    private readonly cli: DeveloperCliService,
    private readonly extension: ExtensionSdkService,
    private readonly plugin: PluginSdkService,
    private readonly localRuntime: LocalDevelopmentRuntimeService,
    private readonly playground: ApiPlaygroundService,
    private readonly sandbox: DeveloperSandboxService,
    private readonly versions: SdkVersionManagerService,
    private readonly publisher: SdkPackagePublisherService,
    private readonly dashboard: DeveloperPlatformDashboardService,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("sdk/generate") generateSdk(@Body() body:any){ return {success:true,sdk:this.sdk.create(body)}; }
  @Post("sdk/universal") universalSdk(@Body() body:any){ return {success:true,sdk:this.universal.create(body)}; }
  @Post("cli/commands") createCliCommand(@Body() body:any){ return {success:true,command:this.cli.create(body)}; }
  @Post("extensions") createExtension(@Body() body:any){ return {success:true,extension:this.extension.create(body)}; }
  @Post("plugins") createPlugin(@Body() body:any){ return {success:true,plugin:this.plugin.create(body)}; }
  @Post("local-runtime") createRuntime(@Body() body:any){ return {success:true,runtime:this.localRuntime.create(body)}; }
  @Post("playground") apiPlayground(@Body() body:any){ return {success:true,session:this.playground.create(body)}; }
  @Post("sandboxes") createSandbox(@Body() body:any){ return {success:true,sandbox:this.sandbox.create(body)}; }
  @Post("sdk/versions") createVersion(@Body() body:any){ return {success:true,version:this.versions.create(body)}; }
  @Post("sdk/publish") publishSdk(@Body() body:any){ return {success:true,publication:this.publisher.create(body)}; }
  @Get("operations/dashboard") operations(){ return {success:true,dashboard:this.dashboard.summary()}; }
}
