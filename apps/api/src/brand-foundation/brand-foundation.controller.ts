import { Body, Controller, Get, Post } from "@nestjs/common";
import { BrandFoundationService } from "./brand-foundation.service";
import { FoundationLayer } from "./brand-foundation.types";

@Controller("brand-foundation")
export class BrandFoundationController {
  constructor(
    private readonly brandFoundation: BrandFoundationService,
  ) {}

  @Get()
  getFoundation() {
    return this.brandFoundation.getFoundation();
  }

  @Get("mandatory-order")
  getMandatoryOrder() {
    return this.brandFoundation.getMandatoryOrder();
  }

  @Post("validate-product")
  validateProduct(
    @Body()
    input: {
      productName: string;
      completedLayers: FoundationLayer[];
    },
  ) {
    return this.brandFoundation.validateProductFoundation(input);
  }

  @Post("validate-entry")
  validateEntry(
    @Body()
    input: {
      productName: string;
      requestedEntryLayer: FoundationLayer;
    },
  ) {
    return this.brandFoundation.validateArchitectureEntry(input);
  }
}