import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { DesignSystemFoundationService } from "./design-system-foundation.service";
import { DesignTokenCategory } from "./design-system-foundation.types";

@Controller("design-system-foundation")
export class DesignSystemFoundationController {
  constructor(
    private readonly designSystem: DesignSystemFoundationService,
  ) {}

  @Get()
  getDesignSystem() {
    return this.designSystem.getDesignSystem();
  }

  @Get("tokens")
  getTokens(
    @Query("category") category?: DesignTokenCategory,
  ) {
    return this.designSystem.getTokens(category);
  }

  @Get("components")
  getComponents() {
    return this.designSystem.getComponents();
  }

  @Post("validate-product")
  validateProduct(
    @Body()
    input: {
      productName: string;
      usedTokens: string[];
      usedComponents: string[];
      accessibilityChecked: boolean;
      responsiveChecked: boolean;
      bilingualChecked: boolean;
    },
  ) {
    return this.designSystem.validateProductUsage(input);
  }
}