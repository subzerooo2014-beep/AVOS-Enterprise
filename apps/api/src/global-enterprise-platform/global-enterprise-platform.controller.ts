import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { GlobalEnterprisePlatformService } from "./global-enterprise-platform.service";
import {
  GlobalPlatformCapability,
  GlobalPlatformEntry,
  GlobalPlatformHealth,
} from "./global-enterprise-platform.types";

@Controller("global-enterprise-platform")
export class GlobalEnterprisePlatformController {
  constructor(private readonly platform: GlobalEnterprisePlatformService) {}

  @Get()
  framework() {
    return this.platform.framework();
  }

  @Post(":capability/entries")
  registerEntry(
    @Param("capability") capability: GlobalPlatformCapability,
    @Body()
    input: Omit<
      GlobalPlatformEntry,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.platform.registerEntry(capability, input);
  }

  @Get("entries")
  listEntries(
    @Query("capability") capability?: GlobalPlatformCapability,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.platform.listEntries(capability, tenantId);
  }

  @Patch("entries/:id/activate")
  activateEntry(@Param("id") id: string) {
    return this.platform.activateEntry(id);
  }

  @Post(":capability/execute")
  execute(
    @Param("capability") capability: GlobalPlatformCapability,
    @Body() input: { entryId: string; operation: string },
  ) {
    return this.platform.execute(capability, input);
  }

  @Post(":capability/health")
  updateHealth(
    @Param("capability") capability: GlobalPlatformCapability,
    @Body()
    input: Omit<
      GlobalPlatformHealth,
      "capability" | "checkedAt"
    >,
  ) {
    return this.platform.updateHealth(capability, input);
  }

  @Get("command-center")
  commandCenter() {
    return this.platform.commandCenter();
  }
}