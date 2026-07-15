import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EcosystemPlatformService } from "./ecosystem-platform.service";
import {
  EcosystemApplication,
  EcosystemCapability,
  EcosystemCredential,
} from "./ecosystem-platform.types";

@Controller("ecosystem-platform")
export class EcosystemPlatformController {
  constructor(private readonly ecosystem: EcosystemPlatformService) {}

  @Get()
  framework() {
    return this.ecosystem.framework();
  }

  @Post(":capability/applications")
  registerApplication(
    @Param("capability") capability: EcosystemCapability,
    @Body()
    input: Omit<
      EcosystemApplication,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.ecosystem.registerApplication(capability, input);
  }

  @Get("applications")
  listApplications(
    @Query("capability") capability?: EcosystemCapability,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.ecosystem.listApplications(capability, tenantId);
  }

  @Patch("applications/:id/activate")
  activateApplication(@Param("id") id: string) {
    return this.ecosystem.activateApplication(id);
  }

  @Post("applications/:id/credentials")
  issueCredential(
    @Param("id") id: string,
    @Body()
    input: {
      credentialType: EcosystemCredential["credentialType"];
      label: string;
    },
  ) {
    return this.ecosystem.issueCredential(id, input);
  }

  @Patch("credentials/:id/rotate")
  rotateCredential(@Param("id") id: string) {
    return this.ecosystem.rotateCredential(id);
  }

  @Post(":capability/execute")
  execute(
    @Param("capability") capability: EcosystemCapability,
    @Body()
    input: {
      applicationId: string;
      action: string;
      payload: Record<string, string | number | boolean>;
    },
  ) {
    return this.ecosystem.execute(capability, input);
  }

  @Get("command-center")
  commandCenter() {
    return this.ecosystem.commandCenter();
  }
}