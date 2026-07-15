import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { GrandBusinessProductService } from "./grand-business-product.service";
import {
  ProductCommandRequest,
  ProductRecord,
} from "./grand-business-product.types";

@Controller("grand-business-product")
export class GrandBusinessProductController {
  constructor(private readonly product: GrandBusinessProductService) {}

  @Get("domains")
  domains() {
    return this.product.domains();
  }

  @Get("domains/:key")
  domain(@Param("key") key: string) {
    return this.product.domain(key);
  }

  @Post("records")
  createRecord(
    @Body()
    input: Omit<ProductRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.product.createRecord(input);
  }

  @Patch("records/:id/activate")
  activateRecord(@Param("id") id: string) {
    return this.product.activateRecord(id);
  }

  @Patch("records/:id/complete")
  completeRecord(@Param("id") id: string) {
    return this.product.completeRecord(id);
  }

  @Get("domains/:key/records")
  recordsForDomain(@Param("key") key: string) {
    return this.product.recordsForDomain(key);
  }

  @Post("execute")
  execute(@Body() request: ProductCommandRequest) {
    return this.product.execute(request);
  }

  @Get("dashboard")
  dashboard() {
    return this.product.dashboard();
  }
}