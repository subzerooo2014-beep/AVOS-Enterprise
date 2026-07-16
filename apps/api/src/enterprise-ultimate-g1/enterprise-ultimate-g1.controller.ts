import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EnterpriseUltimateG1Service } from "./enterprise-ultimate-g1.service";
import {
  G1ComponentDefinition,
  G1ExperienceConfig,
  G1NavigationProfile,
  G1ThemeProfile,
} from "./enterprise-ultimate-g1.types";

@Controller("enterprise-ultimate-g1")
export class EnterpriseUltimateG1Controller {
  constructor(private readonly service: EnterpriseUltimateG1Service) {}

  @Get()
  framework() {
    return this.service.framework();
  }

  @Post("themes")
  createTheme(
    @Body()
    input: Omit<G1ThemeProfile, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createTheme(input);
  }

  @Patch("themes/:id/activate")
  activateTheme(@Param("id") id: string) {
    return this.service.activateTheme(id);
  }

  @Post("navigation")
  createNavigation(
    @Body()
    input: Omit<G1NavigationProfile, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createNavigation(input);
  }

  @Post("experiences")
  configureExperience(
    @Body()
    input: Omit<G1ExperienceConfig, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.service.configureExperience(input);
  }

  @Post("components")
  registerComponent(
    @Body()
    input: Omit<G1ComponentDefinition, "id" | "createdAt">,
  ) {
    return this.service.registerComponent(input);
  }

  @Get("resolve")
  resolveExperience(
    @Query("tenantId") tenantId: string,
    @Query("locale") locale: "ar-AE" | "en-AE",
    @Query("role") role: string,
  ) {
    return this.service.resolveExperience(
      tenantId,
      locale ?? "ar-AE",
      role ?? "USER",
    );
  }

  @Get("command-center")
  commandCenter(@Query("tenantId") tenantId?: string) {
    return this.service.commandCenter(tenantId);
  }
}