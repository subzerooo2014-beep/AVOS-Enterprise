import { Module } from "@nestjs/common";
import { GrandBusinessProductController } from "./grand-business-product.controller";
import { GrandBusinessProductService } from "./grand-business-product.service";

@Module({
  controllers: [GrandBusinessProductController],
  providers: [GrandBusinessProductService],
  exports: [GrandBusinessProductService],
})
export class GrandBusinessProductModule {}